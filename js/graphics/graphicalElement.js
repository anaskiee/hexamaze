"use strict";

function GraphicalElement() {
	this.name = "";
}

GraphicalElement.prototype.handleCursorMove = function() {
}

GraphicalElement.prototype.handleClick = function() {
}

GraphicalElement.prototype.handleKey = function() {
}

/*function A() {
  this.a = "1";
}

A.prototype.echo = function() {
  console.log(this.a);
}

function B() {
  A.call(this);
  this.b = "2";
}

B.prototype = Object.create(A.prototype);
B.prototype.test = function() {
  console.log(this.b);
}

B.prototype.constructor = B;
var b = new B();
b.test();
b.echo();*/