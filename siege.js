"use strict"

var async = require('async');
var Stats = require('fast-stats').Stats;
var Benchmark = require('benchmark');

var tryNextTick = function(deferred){
	process.nextTick(function(){
		deferred.resolve()
	});
}
var tryImmediate = function(deferred){
	setImmediate(function(){
		deferred.resolve()
	});
}

var bench = new Benchmark('process.nextTick1', {
    defer: true,
    fn: tryNextTick
});

var suite = new Benchmark.Suite;

// add tests
suite.add(bench)
// add listeners
.add('process.nextTick2', {
    defer: true,
    fn: tryNextTick
})
.add('setImmediate', {
    defer: true,
    fn: tryImmediate
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
// run async
.run({ 'async': true });