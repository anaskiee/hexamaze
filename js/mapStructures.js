"use strict";

function MapStructures() {
	this.hexagons = new Set();
	this.characterHexagon = null;
	this.exitHexagon = null;
}

MapStructures.prototype.initializeData = function() {
	if (this.hexagons.size > 0) {
		this.hexagons.clear();
		this.characterHexagon = null;
		this.exitHexagon = null;
	}
}

MapStructures.prototype.addHexagon = function(type) {
	var hex = new Hexagon(type);
	this.hexagons.add(hex);
	return hex;
}

MapStructures.prototype.toString = function() {
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

		if (hex.characterHere) {
			idxCharacter = hexa.index;
		}

		if (hex.exitHere) {
			idxExit = hexa.index;
		}

		if (first) {
			first = false;
		} else {
			hexagons += "|";
		}
		hexagons += JSON.stringify(hexa);
	}

	return idxCharacter + "\n" + idxExit + "\n" + hexagons;
}

MapStructures.prototype.fill = function(data) {
	var structures = data.split("\n");
	
	var idxCharacter = parseInt(structures[0]);
	var idxExit = parseInt(structures[1]);
	var hexagonsStringified = structures[2].split("|");

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
				case "i":
					hexagon.i = partialHex.i;
					break;
				case "j":
					hexagon.j = partialHex.j;
					break;
				case "index":
					break;
				case "type":
					break;
				default:
					hexagon[prop] = indexes.get(partialHex[prop]);
					break;
			}
			//hexagon.top 		= indexes.get(partialHex.top);
			//hexagon.topLeft		= indexes.get(partialHex.topLeft);
			//hexagon.topRight	= indexes.get(partialHex.topRight);
			//hexagon.bot 		= indexes.get(partialHex.bot);
			//hexagon.botLeft		= indexes.get(partialHex.botLeft);
			//hexagon.botRight	= indexes.get(partialHex.botRight);
		}
	}

	// Character and exit
	this.characterHexagon = indexes.get(idxCharacter);
	this.characterHexagon.characterHere = true;
	this.exitHexagon = indexes.get(idxExit);
	this.exitHexagon.exitHere = true;
}