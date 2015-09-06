"use strict";

function Level() {
	this.hexagons = new Set();
	this.characterHexagon = null;
	this.exitHexagon = null;
	this.firstColumnOnTop = false;
}

Level.prototype.clearData = function() {
	if (this.hexagons.size > 0) {
		this.hexagons.clear();
		this.characterHexagon = null;
		this.exitHexagon = null;
		this.firstColumnOnTop = false;
	}
}

Level.prototype.addHexagon = function(type) {
	var hex = new Hexagon(type);
	this.hexagons.add(hex);
	return hex;
}

Level.prototype.removeHexagon = function(hex) {
	var done = this.hexagons.delete(hex);
	if (hex == this.characterHexagon) {
		this.characterHexagon = null;
	}
	if (hex == this.exitHexagon) {
		this.exitHexagon = null;
	}
}

Level.prototype.isLevelFinished = function() {
	if (this.characterHexagon == null)
		return false;
	if (this.exitHexagon == null)
		return false;
	if (this.hexagons.length == 0)
		return false;
	return true;
}

Level.prototype.getAnHexagon = function() {
	for (var hex of this.hexagons) {
		return hex;
	}
}

Level.prototype.toString = function() {
	var idx = 0;
	var hexa;
	var hexagons = "";
	var idxCharacter, idxExit;
	
	// Define hexagons indexes because references will be lost during stringification
	var indexes = new Map();
	for (var hex of this.hexagons) {
		indexes.set(hex, idx);
		idx++;
	}

	var first = true;
	for (var hex of this.hexagons) {
		hexa = {
			index : indexes.get(hex),
			type : hex.type,
			i : hex.i,
			j : hex.j,
			top : indexes.get(hex.top),
			topLeft : indexes.get(hex.topLeft),
			topRight : indexes.get(hex.topRight),
			bot : indexes.get(hex.bot),
			botLeft : indexes.get(hex.botLeft),
			botRight : indexes.get(hex.botRight)
		};

		// Save character and exit hexagon
		idxCharacter = indexes.get(this.characterHexagon);
		idxExit = indexes.get(this.exitHexagon);

		if (first) {
			first = false;
		} else {
			hexagons += "|";
		}
		hexagons += JSON.stringify(hexa);
	}

	return this.firstColumnOnTop + ";" + idxCharacter + ";" + idxExit + ";" + hexagons;
}

Level.prototype.fill = function(data) {
	var structures = data.split(";");

	this.firstColumnOnTop = structures[0] == "true";
	var idxCharacter = parseInt(structures[1]);
	var idxExit = parseInt(structures[2]);
	var hexagonsStringified = structures[3].split("|");

	var hexagons = new Set();
	var indexes = new Map();
	var partialHex, hexagon;

	// Add all hexagons and saves indexe references
	for (var hex of hexagonsStringified) {
		partialHex = JSON.parse(hex);
		hexagon = this.addHexagon(partialHex.type);
		indexes.set(partialHex.index, hexagon);
	}

	// Link hexagons
	for (var hex of hexagonsStringified) {
		partialHex = JSON.parse(hex);
		hexagon = indexes.get(partialHex.index);
		// Some links are null and have not been serialized
		// one must not update them
		for (var prop in partialHex) {
			switch (prop) {
				case "index":
					break;
				case "type":
					break;
				default:
					// some directions are not taken
					// they're let set to null
					hexagon[prop] = indexes.get(partialHex[prop]);
					break;
			}
		}
	}

	// Character and exit
	this.characterHexagon = indexes.get(idxCharacter);
	this.exitHexagon = indexes.get(idxExit);
}