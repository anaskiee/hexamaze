"use strict";

function Pattern() {
	this.drawings = new Map();
}

Pattern.prototype.draw = function(ctx, style, x, y) {
	ctx.save();
	ctx.translate(-this.width/2, -this.height/2);
	ctx.drawImage(this.drawings.get(style), x, y);
	ctx.restore();
}

// [{x: x0, y: y0}, {x: x1, y:y1}]
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
