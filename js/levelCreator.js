"use strict";

function LevelCreator(level) {
	this.level = level;
	
	this.hexagons = null;
	this.nbLines = -1;
	this.nbColumns = -1;
	this.firstColumnOnTop = false;
	this.positionsSaved = null;
}

LevelCreator.prototype.createRandomLevel = function(nbLines, nbColumns) {
	this.createBasicLevel(nbLines, nbColumns);
	this.randomize(15);
};

LevelCreator.prototype.createEditingLevel = function(nbLines, nbColumns) {
	this.createEmptyLevel(nbLines, nbColumns);
	this.randomize(0);
};

LevelCreator.prototype.createBasicLevel = function(nbLines, nbColumns) {
	this.createEmptyLevel(nbLines, nbColumns);
	
	// Initialiaze block types
	for (var i = 0; i < this.nbLines; i++) {
		for (var j = 0; j < this.nbColumns; j++) {
			if (i === 0 || j === 0 || i === this.nbLines-1 || j === this.nbColumns-1) {
				this.hexagons[i][j].type = "block";
			}
		}
	}
};

LevelCreator.prototype.createEmptyLevel = function(nbLines, nbColumns) {
	this.nbLines = nbLines;
	this.nbColumns = nbColumns;
	this.firstColumnOnTop = true;

	// Object where cleaned data are stored
	this.level.clearData();

	// Init reference structure
	this.hexagons = new Array(this.nbLines);
	for (var i = 0; i < this.nbLines; i++) {
		this.hexagons[i] = new Array(this.nbColumns);
	}

	// Initialiaze empty blocks
	for (var i = 0; i < this.nbLines; i++) {
		for (var j = 0; j < this.nbColumns; j++) {
			this.hexagons[i][j] = this.level.addHexagon("space");
		}
	}

	// Define first column position
	this.level.firstColumnOnTop = this.firstColumnOnTop;

	// Link all hexagons
	this.setLinks();
};

LevelCreator.prototype.setLinks = function() {
	var hexagon;
	// Initialize links between hexagons
	for (var i = 0; i < this.nbLines; i++) {
		for (var j = 0; j < this.nbColumns; j++) {
			hexagon = this.hexagons[i][j];

			if (hexagon === null) {
				continue;
			}

			// Links
			// top
			hexagon.top = i > 0 ? this.hexagons[i-1][j] : null;

			// bot
			hexagon.bot = i < this.nbLines - 1 ? this.hexagons[i+1][j] : null;

			var lines = this.getBotAndTopLineIndex(i, j);
			var botLine = lines.botLine;
			var topLine = lines.topLine;

			var topLineExists = topLine >= 0;
			var botLineExists = botLine <= this.nbLines-1;
			var leftColumnExists = j > 0;
			var rightColumnExists = j < this.nbColumns-1;

			// topLeft / topRight
			if (topLineExists) {
				if (leftColumnExists) {
					hexagon.topLeft = this.hexagons[topLine][j-1];
				} else {
					hexagon.topLeft = null;
				}

				if (rightColumnExists) {
					hexagon.topRight = this.hexagons[topLine][j+1];
				} else {
					hexagon.topRight = null;
				}
			} else {
				hexagon.topLeft = null;
				hexagon.topRight = null;
			}

			// botLeft / botRight
			if (botLineExists) {
				if (leftColumnExists) {
					hexagon.botLeft = this.hexagons[botLine][j-1];
				} else {
					hexagon.botLeft = null;
				}

				if (rightColumnExists) {
					hexagon.botRight = this.hexagons[botLine][j+1];
				} else {
					hexagon.botRight = null;
				}
			} else {
				hexagon.botLeft = null;
				hexagon.botRight = null;
			}
		}
	}
};

LevelCreator.prototype.randomize = function(blockPercent) {
	var limit = blockPercent / 100;
	var hexagon;
	var idx;

	// Character
	var characterHexagon = this.getRandomHexagon();
	this.level.character.hexagon = characterHexagon;
	
	// Exit
	var exitHexagon = this.getRandomHexagon();
	while (exitHexagon === characterHexagon) {
		var exitHexagon = this.getRandomHexagon();
	}
	this.level.exitHexagon = exitHexagon;

	// Blocks
	for (var i = 1; i < this.nbLines-1; i++) {
		for (var j = 1; j < this.nbColumns-1; j++) {
			hexagon = this.hexagons[i][j];
			if (hexagon.type === "space" && hexagon !== characterHexagon 
				&& hexagon !== exitHexagon) {
				if (Math.random() < limit) {
					hexagon.type = "block";
				}
			}
		}
	}
};

LevelCreator.prototype.getRandomHexagon = function() {
	var x = Math.floor(Math.random() * this.nbColumns);
	var y = Math.floor(Math.random() * this.nbLines);
	return this.hexagons[y][x];
};

LevelCreator.prototype.clearData = function() {
	this.hexagons = null;
	this.nbLines = -1;
	this.nbColumns = -1;
	this.firstColumnOnTop = false;
};

LevelCreator.prototype.getHexagonColumn = function(hexagon) {
	var currHex, nextHex;
	var directions = ["top", "topLeft", "topRight", "bot", "botLeft", "botRight"];
	var hexagons = [];
	// To store column of hexagons found
	var marks = new Map();
	hexagons.push(hexagon);
	marks.set(hexagon, 0);
	var column;

	// Compute all relative positions
	while (hexagons.length > 0) {
		currHex = hexagons.shift();
		column = marks.get(currHex);
		for (var dir of directions) {
			nextHex = currHex[dir];
			if (nextHex !== null && !marks.has(nextHex)) {
				hexagons.push(nextHex);
				switch (dir) {
					case "top":
					case "bot":
						marks.set(nextHex, column);
						break;
					case "topLeft":
					case "botLeft":
						marks.set(nextHex, column - 1);
						break;
					case "topRight":
					case "botRight":
						marks.set(nextHex, column + 1);
						break;
				}
			}
		}
	}

	var min = 0;
	for (var column of marks.values()) {
		var min = Math.min(min, column);
	}

	return -min;
};

LevelCreator.prototype.fillEditingStructure = function() {
	this.firstColumnOnTop = this.level.firstColumnOnTop;
	var currHex, nextHex;
	var directions = ["top", "topLeft", "topRight", "bot", "botLeft", "botRight"];
	var hexagons = [];
	var marks = new Map();
	var hexagon = this.level.getAnHexagon();
	hexagons.push(hexagon);
	var hexColumn = this.getHexagonColumn(hexagon);
	marks.set(hexagon, [0, hexColumn]);
	var position, i, j;
	var columnEven;
	var botSameLine, topSameLine;
	var botLine, topLine;

	// Compute all relative positions
	while (hexagons.length > 0) {
		currHex = hexagons.shift();
		position = marks.get(currHex);
		i = position[0];
		j = position[1];

		var lines = this.getBotAndTopLineIndex(i, j);
		var botLine = lines.botLine;
		var topLine = lines.topLine;

		for (var dir of directions) {
			nextHex = currHex[dir];
			if (nextHex !== null && !marks.has(nextHex)) {
				hexagons.push(nextHex);
				switch (dir) {
					case "top":
						marks.set(nextHex, [i - 1, j]);
						break;
					case "bot":
						marks.set(nextHex, [i + 1, j]);
						break;
					case "topLeft":
						marks.set(nextHex, [topLine, j - 1]);
						break;
					case "topRight":
						marks.set(nextHex, [topLine, j + 1]);
						break;
					case "botLeft":
						marks.set(nextHex, [botLine, j - 1]);
						break;
					case "botRight":
						marks.set(nextHex, [botLine, j + 1]);
						break;
				}
			}
		}
	}

	// Compute max dimensions
	var iMin = 0;
	var iMax = 0;
	var jMin = 0;
	var jMax = 0;
	for (var relPos of marks.values()) {
		iMin = Math.min(iMin, relPos[0]);
		iMax = Math.max(iMax, relPos[0]);
		jMin = Math.min(jMin, relPos[1]);
		jMax = Math.max(jMax, relPos[1]);
	}

	// Init reference structure
	this.nbLines = iMax - iMin + 1;
	this.nbColumns = jMax - jMin + 1;
	this.hexagons = new Array(this.nbLines);
	for (var i = 0; i < this.nbLines; i++) {
		this.hexagons[i] = new Array(this.nbColumns);
		for (var j = 0; j < this.nbColumns; j++) {
			this.hexagons[i][j] = null;
		}
	}

	// Column offset is already done because the first hexagon was initialized
	// with his real column number
	for (var mark of marks.values()) {
		mark[0] -= iMin;
	}

	// Place hexagons in array
	for (var entry of marks.entries()) {
		var hex = entry[0];
		var pos = entry[1];
		this.hexagons[pos[0]][pos[1]] = hex;
	}
};

LevelCreator.prototype.getBotAndTopLineIndex = function(i, j) {
	var botSameLine, topSameLine;
	var columnEven = j % 2 === 0;

	// Basic case : columnEven and firstColumnOnTop
	botSameLine = true;

	if (!columnEven)
		botSameLine = !botSameLine;

	if (!this.firstColumnOnTop)
		botSameLine = !botSameLine;
	
	// top and bot can't be on the same line
	topSameLine = !botSameLine;

	var botLine = botSameLine ? i : i+1;
	var topLine = topSameLine ? i : i-1;

	return {botLine: botLine, topLine: topLine};
};

LevelCreator.prototype.getNewLine = function() {
	var line = new Array(this.nbColumns);
	for (var j = 0; j < this.nbColumns; j++) {
		line[j] = this.level.addHexagon("space");
	}
	return line;
};

LevelCreator.prototype.addLineFirst = function() {
	var line = this.getNewLine();
	this.hexagons.unshift(line);
	this.nbLines++;
	this.setLinks();
};

LevelCreator.prototype.addLineLast = function() {
	var line = this.getNewLine();
	this.hexagons.push(line);
	this.nbLines++;
	this.setLinks();
};

LevelCreator.prototype.addColumnFirst = function() {
	for (var i = 0; i < this.nbLines; i++) {
		var hex = this.level.addHexagon("space");
		this.hexagons[i].unshift(hex);
	}
	this.nbColumns++;
	this.firstColumnOnTop = !this.firstColumnOnTop;
	this.level.firstColumnOnTop = this.firstColumnOnTop;
	this.setLinks();
};

LevelCreator.prototype.addColumnLast = function() {
	for (var i = 0; i < this.nbLines; i++) {
		var hex = this.level.addHexagon("space");
		this.hexagons[i].push(hex);
	}
	this.nbColumns++;
	this.setLinks();
};

LevelCreator.prototype.canHexagonBeRemoved = function(hex) {
	if (hex === this.level.character.hexagon || hex === this.level.exitHexagon) {
		console.log("warning: can't remove this line/column");
		alert("operation impossible : exit or character would be removed");
		return false;
	}
	if (this.positionsSaved !== null) {
		if (hex === this.positionsSaved.character 
			|| hex === this.positionsSaved.exit) {
			console.log("warning: can't remove this line/column because of save");
			alert("operation impossible : saved exit or character would be removed");
			return false;
		}
	}
	return true;
};

LevelCreator.prototype.removeFirstLine = function() {
	if (this.nbLines === 0)
		return;

	for (var j = 0; j < this.nbColumns; j++) {
		var hex = this.hexagons[0][j];
		if (!this.canHexagonBeRemoved(hex)) {
			return;
		}
	}
	for (var j = 0; j < this.nbColumns; j++) {
		var hex = this.hexagons[0][j];
		this.level.removeHexagon(hex);
	}
	this.hexagons.splice(0, 1);
	this.nbLines--;
	this.setLinks();
};

LevelCreator.prototype.removeLastLine = function() {
	if (this.nbLines === 0)
		return;
	for (var j = 0; j < this.nbColumns; j++) {
		var hex = this.hexagons[this.nbLines-1][j];
		if (!this.canHexagonBeRemoved(hex)) {
			return;
		}
	}
	for (var j = 0; j < this.nbColumns; j++) {
		var hex = this.hexagons[this.nbLines-1][j];
		this.level.removeHexagon(hex);
	}
	this.hexagons.splice(-1, 1);
	this.nbLines--;
	this.setLinks();
};

LevelCreator.prototype.removeFirstColumn = function() {
	if (this.nbColumns === 0)
		return;

	for (var i = 0; i < this.nbLines; i++) {
		var hex = this.hexagons[i][0];
		if (!this.canHexagonBeRemoved(hex)) {
			return;
		}
	}
	for (var i = 0; i < this.nbLines; i++) {
		var hex = this.hexagons[i][0];
		this.level.removeHexagon(hex);
		this.hexagons[i].splice(0, 1);
	}
	this.nbColumns--;
	this.firstColumnOnTop = !this.firstColumnOnTop;
	this.level.firstColumnOnTop = this.firstColumnOnTop;
	this.setLinks();
};

LevelCreator.prototype.removeLastColumn = function() {
	if (this.nbColumns === 0)
		return;

	for (var i = 0; i < this.nbLines; i++) {
		var hex = this.hexagons[i][this.nbColumns-1];
		if (!this.canHexagonBeRemoved(hex)) {
			return;
		}
	}
	for (var i = 0; i < this.nbLines; i++) {
		var hex = this.hexagons[i][this.nbColumns-1];
		this.level.removeHexagon(hex);
		this.hexagons[i].splice(-1, 1);
	}
	this.nbColumns--;
	this.setLinks();
};

LevelCreator.prototype.setHexagonStyle = function(hexagon, style) {
	hexagon.type = style;
};

LevelCreator.prototype.setCharacterHexagon = function(hexagon) {
	this.level.character.hexagon = hexagon;
};

LevelCreator.prototype.setExitHexagon = function(hexagon) {
	this.level.exitHexagon = hexagon;
};

LevelCreator.prototype.save = function() {
	this.positionsSaved = {
		character: this.level.character.hexagon,
		exit: this.level.exitHexagon
	};
};

LevelCreator.prototype.restore = function() {
	this.level.character.hexagon = this.positionsSaved.character;
	this.level.exitHexagon = this.positionsSaved.exit;
	this.positionsSaved = null;
};
