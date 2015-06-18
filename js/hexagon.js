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

	this.characterHere = false;
	this.exitHere = false;
	this.isReachable = false;
	this.isPreselected = false;

	// To avoid ton of calculation for each frame
	this.x = -1;
	this.y = -1;
}