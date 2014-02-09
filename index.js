"use strict"

var Q = require('q');
var async = require('async');
var Stats = require('fast-stats').Stats;

var threads = 2;


function thinger(thread, a, cb) {
	// includes max
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	var delay = getRandomInt(10, 20);
	// console.log(thread, '-', a);
	setTimeout(function() {
		// console.log(thread, '+', a);
		cb(null, a * 2);
	}, delay);
}

//  global termination context
var count = 0;
var start = +new Date();
var statii = {};
var termination = function() {
	var delta = +new Date() - start;
	// console.log('delta', delta);
	return count < 10;
};

var stats = new Stats({store_data: false});

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
			progress(thId, '+' + param,delta);
			itCallback(err);
		});
	};
}

// function generator - not invoked immediately
var oneThread = function(id) {
	return function(thCallback) {
		var threadResult = function(err) {
			// console.log(id, 'thingers done');
			thCallback(err);
		};
		async.whilst(termination, iteration(id), threadResult);
	}
};

function manyThreads(nThreads) {
	var finalResult = function(err, results) {
		console.log('all thingers done');
		console.log('stats',{th:nThreads,n:stats.length,μ:stats.μ().toFixed(2),σ:stats.σ().toFixed(2)});
	};
	var tasks = [];
	for (var i = 0; i < nThreads; i++) {
		tasks.push(oneThread("t" + i));
	};
	async.parallel(tasks, finalResult);
}

manyThreads(5);