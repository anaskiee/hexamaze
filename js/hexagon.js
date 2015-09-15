"use strict";

function Hexagon(type)
{
	// Type in physics engine 
	// Style in graphics engine
	this.type 		= type;

	// Define others hexagons next to this one
	this.top 		= null;
	this.topLeft 	= null;
	this.topRight 	= null;
	this.bot 		= null;
	this.botLeft 	= null;
	this.botRight 	= null;

	this.isReachable = false;
	this.isPreselected = false;

	// To avoid ton of calculation for each frame
	this.x = -1;
	this.y = -1;
}

Hexagon.prototype.handleClick = function(x, y) {
	return "click";
}

Hexagon.prototype.handleCursorMove = function(x, y) {
	this.type = "block";
	return "mouse over me !";
}

Hexagon.prototype.onMouseOverEnd = function() {
	this.type = "space";
}