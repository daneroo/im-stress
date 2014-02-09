"use strict"

// var Q = require('q');
var async = require('async');
var Stats = require('fast-stats').Stats;
var request = require('request');

var threads = 2;

function thinger(thread, a, cb) {
	var url = 'http://localhost:8000/';
	// var url = 'http://localhost:9000/api/awesomeThings';
	// var url = 'http://copa-do-mundo.herokuapp.com/api/awesomeThings';
	// process.nextTick(function(){
	setImmediate(function(){
		cb();
	});
	if (0) request.get(url, function(error, response, body) {
		// console.log(body);
		// console.log('http return code',response.statusCode);
		cb();
	});
}

function thingerOld(thread, a, cb) {
	// includes max
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	var delay = getRandomInt(10, 20);
	console.log(thread, '-', a);
	setTimeout(function() {
		console.log(thread, '+', a);
		// cb(null, a * 2);
		cb((a === 5) ? "Error 9" : null, a * 2);
	}, delay);
}

//  global termination context
var count = 0;
var start = +new Date();

//runtime status / per thread
var statii = {};
var termination = function() {
	var delta = +new Date() - start;
	// console.log('delta', delta);
	return count < 1000;
};

// these are for respose times
var stats = new Stats({
	store_data: false
});

function progress(thId, status) {
	statii[thId] = status;
	// console.log(statii);
}
// generator to bind thread id
var iteration = function(thId) {
	return function(itCallback) {
		var param = count++;
		progress(thId, '-' + param);
		var start = +new Date();
		thinger(thId, param, function(err, res) {
			var delta = +new Date() - start;
			stats.push(delta);
			// accumulate or test reults
			progress(thId, '+' + param);

			//  should actually ignore errors, or theis thread will stop.			
			itCallback(err);
		});
	};
}

// function generator - not invoked immediately
var oneThread = function(id) {
	return function(thCallback) {
		var threadResult = function(err) {
			// console.log(id, 'thingers done', (err)?err:'');
			thCallback(err);
		};
		async.whilst(termination, iteration(id), threadResult);
	}
};

function manyThreads(nThreads) {
	var finalResult = function(err, results) {
		console.log('all thingers done');
		console.log('stats', {
			th: nThreads,
			n: stats.length,
			μ: stats.μ().toFixed(2),
			σ: stats.σ().toFixed(2)
		});
	};
	var tasks = [];
	for (var i = 0; i < nThreads; i++) {
		tasks.push(oneThread("t" + i));
	};
	async.parallel(tasks, finalResult);
}

manyThreads(2);