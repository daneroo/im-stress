"use strict"

// This file simply benchmarks the two timing classes in im-timer:
//  Conclusion:
// MiliTimer is twice as fast as NanoTimer to construct 2e6 vs 1e6 ops/s
//  same holds for taking delta.
var Benchmark = require('benchmark');

var MiliTimer = require('./lib/im-timer.js').MiliTimer;
var NanoTimer = require('./lib/im-timer.js').NanoTimer;

var suite = new Benchmark.Suite;

var mili = new MiliTimer();
var nano = new NanoTimer();
// add tests
suite.add('new MiliTimer', function() {
  new MiliTimer();
})
.add('new NanoTimer', function() {
  new NanoTimer();
})
.add('mili.reset', function() {
  mili.reset();
})
.add('nano.reset', function() {
  nano.reset();
})
.add('mili.delta', function() {
  mili.delta();
})
.add('mili.deltaNano', function() {
  mili.delta();
})
.add('nano.delta', function() {
  nano.delta();
})
.add('nano.deltaNano', function() {
  nano.delta();
})
// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
// run async
.run({ 'async': true });