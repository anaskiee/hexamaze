"use strict";

function Pattern() {
	this.drawings = new Map();
}

Pattern.prototype.draw = function(ctx, style, x, y) {
	if (style == "selected") {
		ctx.save();
		ctx.translate(x - this.width/2 - 5, y - this.height/2 - 5);
		ctx.strokeStyle = "#AAAAAA";
		ctx.strokeRect(0.5, 0.5, this.width-1 + 10, this.height-1 + 10);
		ctx.restore();
	} else {
		ctx.save();
		ctx.translate(-this.width/2, -this.height/2);
		ctx.drawImage(this.drawings.get(style), x, y);
		ctx.restore();
	}
}

// Method to draw path without anti-aliasing
Pattern.prototype.fillPath = function(ctx, pointsList, color) {
	var curr, next;
	var x0, y0, x1, y1;
	var dx, dy;
	var sx, sy, err, e2;
	ctx.beginPath();
	ctx.moveTo(pointsList[0].x , pointsList[0].y);
	for (var i = 0; i < pointsList.length; i++) {
		curr = pointsList[i];
		next = pointsList[(i + 1) % pointsList.length];
		x0 = Math.round(curr.x);
		y0 = Math.round(curr.y);
		x1 = Math.round(next.x);
		y1 = Math.round(next.y);
		if (isNaN(x0) || isNaN(y0) || isNaN(x1) || isNaN(y1)) {
			console.log("Invalid path");
			return;
		}
		
		// Bresenham's line algorithm
		dx = Math.abs(x1 - x0);
		sx = x0 < x1 ? 1 : -1;
		dy = Math.abs(y1 - y0);
		sy = y0 < y1 ? 1 : -1; 
		err = (dx > dy ? dx : -dy)/2;

		while (true) {
			if (x0 == x1 && y0 == y1)
				break;
			e2 = err;
			if (e2 > -dx) { 
				err -= dy; 
				x0 += sx; 
				ctx.lineTo(x0, y0);
			}
			if (e2 < dy) { 
				err += dx; 
				y0 += sy; 
				ctx.lineTo(x0, y0);
			}
		}
	}
	ctx.closePath()
	ctx.fillStyle = color;
	ctx.fill();
}

// Method to draw disk without anti-aliasing
Pattern.prototype.fillDisk = function(ctx, x0, y0, radius, color) {
	var octants = new Array(8);
	for (var i = 0; i < 8; i++) {
		octants[i] = [];
	}

	// Midpoint circle algorithm
	var x = radius;
	var y = 0;
	var decisionOver2 = 1 - x;
	while (y <= x) {
		y++;
		this.addPoints(octants, x0, y0, x, y);
		if (decisionOver2 <= 0) {
			decisionOver2 += 2*y + 1;
		} else {
			x--;
			this.addPoints(octants, x0, y0, x, y);
			decisionOver2 += 2*(y - x) + 1;
		}
	}

	var pointsList = octants[0].concat(octants[1], octants[2], octants[3], octants[4],
										octants[5], octants[6], octants[7]);
	var point;
	ctx.beginPath();
	ctx.moveTo(pointsList[0].x, pointsList[0].y);
	for (var i = 1; i < pointsList.length; i++) {
		point = pointsList[i];
		ctx.lineTo(point.x, point.y);
	}
	ctx.closePath();
	ctx.fillStyle = color;
	ctx.fill();
}

Pattern.prototype.addPoints = function(octants, x0, y0, x, y) {
	octants[0].push({x: x0 + x, y: y0 + y});
	octants[1].unshift({x: x0 + y, y: y0 + x});
	octants[2].push({x: x0 - y, y: y0 + x});
	octants[3].unshift({x: x0 - x, y: y0 + y});
	octants[4].push({x: x0 - x, y: y0 - y});
	octants[5].unshift({x: x0 - y, y: y0 - x});
	octants[6].push({x: x0 + y, y: y0 - x});
	octants[7].unshift({x: x0 + x, y: y0 - y});
}
