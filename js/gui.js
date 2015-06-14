"use strict";

function Gui(r1, r2, r3, hexagonPatterns) {
	this.r1 = r1;
	this.r2 = r2;
	this.r3 = r3;
	this.r4 = (r3-r2) / 2;
	this.hexagonPatterns = hexagonPatterns;
}

Gui.prototype.draw = function(ctx, x, y, theta) {
	// Draw central hexagon
	let side = (theta / (Math.PI/3) + 6) % 6 ;
	let advancedStyle;
	if (side < 1) {
		advancedStyle = "botright";
	} else if (side < 2) {
		advancedStyle = "bot";
	} else if (side < 3) {
		advancedStyle = "botleft";
	} else if (side < 4) {
		advancedStyle = "topleft";
	} else if (side < 5) {
		advancedStyle = "top";
	} else {
		advancedStyle = "topright";
	}

	let pattern = this.hexagonPatterns.get("space-" + advancedStyle);
	ctx.drawImage(pattern, x - pattern.width/2, y - pattern.height/2);

	// Draw
	ctx.beginPath();
	ctx.arc(x, y, this.r2, 0, 2*Math.PI);
	ctx.closePath();
	ctx.strokeStyle = "#AAAAAA";
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(x, y, this.r3, 0, 2*Math.PI);
	ctx.closePath();
	ctx.strokeStyle = "#AAAAAA";
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(x + (this.r2 + this.r4) * Math.cos(theta), y + (this.r2 + this.r4) * Math.sin(theta), this.r4, 0, 2*Math.PI);
	ctx.closePath();
	ctx.fillStyle = "#888888";
	ctx.fill();
}