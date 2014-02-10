"use strict"

var MiliTimer = function() {
  this.reset();
}

MiliTimer.prototype.reset = function() {
  this.start = +new Date();
  // this.startNano = process.hrtime();
}

MiliTimer.prototype.delta = function() {
  return +new Date() - this.start;
}
MiliTimer.prototype.deltaNano = function() {
  return this.delta() * 1e6;
}
MiliTimer.prototype.deltaInSeconds = function() {
  return this.delta() / 1e3;
}

var NanoTimer = function() {
  this.reset();
}

NanoTimer.prototype.reset = function() {
  this.start = process.hrtime();
}

NanoTimer.prototype.delta = function() {
  return this.deltaNano() / 1e6;
}
NanoTimer.prototype.deltaNano = function() {
  var delta = process.hrtime(this.start);
  return delta[0] * 1e9 + delta[1];
}
NanoTimer.prototype.deltaInSeconds = function() {
  return this.deltaNano() / 1e9;
}

// var tt=new MiliTimer();
// var tt=new NanoTimer();
// console.log('-',tt.deltaInSeconds());
// console.log('+',tt.deltaInSeconds());
// tt.reset()
// console.log('-',tt.deltaInSeconds());
// console.log('+',tt.deltaInSeconds());

module.exports = exports = {
  MiliTimer: MiliTimer,
  NanoTimer: NanoTimer
};
