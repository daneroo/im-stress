"use strict"

// Meant to use Benchmark to replace our loops,
// but that won't cut it, neither for parallell exec, nor clustering

var async = require('async');
var Stats = require('fast-stats').Stats;
var Benchmark = require('benchmark');

var tickCount=0;
var tryNextTick = function(deferred){
  tickCount++;
	process.nextTick(function(){
		deferred.resolve()
	});
}
var tryImmediate = function(deferred){
	setImmediate(function(){
		deferred.resolve()
	});
}

Benchmark.options.defer=true;
// Benchmark.options.minTime=10;
// Benchmark.options.maxTime=10;
// Benchmark.options.minSamples=10;
console.log(Benchmark.options);

var bench = new Benchmark('process.nextTick1', {
    // defer: true,
    cycles:3,
    async:true,
    fn: tryNextTick
});

bench
.on('cycle', function(event) {
  console.log('cycle',tickCount);
  // console.log('event',event);
})
.on('complete', function(event) {
  console.log('summary',this.toString());
  // console.log('times',this.times);
  // console.log('stats',this.stats);
  // console.log('event',event);
  console.log('tickCount',tickCount)
})
// .run();

var suite = new Benchmark.Suite;

// add tests
suite.add(bench)
.add(bench)
// add listeners
.add('process.nextTick2', {
    // defer: true,
    fn: tryNextTick
})
.add('setImmediate', {
    // defer: true,
    fn: tryImmediate
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
  console.log('tickCount',tickCount);
})
// run async
.run({ 'async': true });