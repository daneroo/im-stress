"use strict"

// var Q = require('q');
var async = require('async');
var Stats = require('fast-stats').Stats;
var request = require('request');
var Timer = require('./lib/im-timer.js').MiliTimer; // or NanoTimer

var threads = 1;
var totalCount = 1000000;

function thinger(cb) {
	var url = 'http://localhost:8000/';
	// var url = 'http://localhost:9000/api/awesomeThings';
	// var url = 'http://copa-do-mundo.herokuapp.com/api/awesomeThings';
	// process.nextTick(function(){
	if (1) setImmediate(function() {
		cb();
	});
	if (0) request.get(url, function(error, response, body) {
		// console.log(body);
		// console.log('http return code',response.statusCode);
		cb();
	});
}

function thingerOld(cb) {
	// includes max
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	var delay = getRandomInt(10, 20);
	// console.log(thread, '-', a);
	setTimeout(function() {
		// console.log(thread, '+', a);
		// cb(null, a * 2);
		cb((a === 5) ? "Error 9" : null, a * 2);
	}, delay);
}

//  global termination context
var count = 0;

// var threadStart = +new Date();
var threadTimer = new Timer();

//runtime status / per thread
var statii = {};
var termination = function() {
	// do the time in an eventHandler
	// var delta = threadTimer.delta();
	// console.log('delta', delta);
	return count < totalCount;
};

// these are for respose times
var stats = new Stats({
	store_data: false
});

function progress(thId, status) {
	statii[thId] = status;
	// console.log(statii);
}

// where do these go ?
// 	var param = count++;
// stats.push(delta);

var iteration = require('./lib/timedInvoker').invokerWrapper(thinger, function(delta,err,result) {
	stats.push(delta);
	count++;
});

// function generator - not invoked immediately
var oneThread = function(id) {
	return function(thCallback) {
		var threadResult = function(err) {
			// console.log(id, 'thingers done', (err)?err:'');
			console.log(id, 'thingers done', threadTimer.deltaInSeconds());
			thCallback(err);
		};
		async.whilst(termination, iteration, threadResult);
	}
};

function manyThreads(nThreads) {
	var finalResult = function(err, results) {
		var deltaS = threadTimer.deltaInSeconds();
		console.log('all thingers done', deltaS);
		console.log('stats', JSON.stringify({
			th: nThreads,
			n: stats.length,
			μ: stats.μ().toFixed(4) + ' ms/req',
			σ: stats.σ().toFixed(4) + ' ms/req',
			τ: (stats.length / deltaS).toFixed(2) + ' req/s'
		}));
	};
	var tasks = [];
	for (var i = 0; i < nThreads; i++) {
		tasks.push(oneThread("t" + i));
	};
	async.parallel(tasks, finalResult);
}

manyThreads(threads);