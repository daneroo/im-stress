"use strict"

// var Q = require('q');
var async = require('async');
var Stats = require('fast-stats').Stats;
var request = require('request');

var threads = 2;
var totalCount = 10000;
function thinger(thread, a, cb) {
	var url = 'http://localhost:8000/';
	// var url = 'http://localhost:9000/api/awesomeThings';
	// var url = 'http://copa-do-mundo.herokuapp.com/api/awesomeThings';
	// process.nextTick(function(){
	if (0) setImmediate(function(){
		cb();
	});
	if (1) request.get(url, function(error, response, body) {
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
var TT = function(){
	this.reset = function(){
		this.startMili=+new Date();
		// this.startNano = process.hrtime();
	}
	this.reset();
	this.deltaMili = function(){
		// return this.deltaNano()/1e6;
		return +new Date() - this.startMili;
	}
	this.deltaNano = function(){
		var delta = process.hrtime(this.startNano);
		return delta[0]*1e9 + delta[1];
	}
	this.deltaInSeconds = function(){
		return this.deltaMili()/1e3;
		// return this.deltaNano()/1e9;
	}
}
// var threadStart = +new Date();
var threadTimer = new TT();

//runtime status / per thread
var statii = {};
var termination = function() {
	var delta = threadTimer.deltaMili();
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
// generator to bind thread id
var iteration = function(thId) {
	// reuse this time to avoid constructor.
	var invocationTimer = new TT();
	return function(itCallback) {
		var param = count++;
		progress(thId, '-' + param);
		// var invocationStart = +new Date();
		invocationTimer.reset();
		thinger(thId, param, function(err, res) {
			// var delta = +new Date() - invocationStart;
			var delta = invocationTimer.deltaMili();
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
			console.log(id, 'thingers done', threadTimer.deltaInSeconds());
			thCallback(err);
		};
		async.whilst(termination, iteration(id), threadResult);
	}
};

function manyThreads(nThreads) {
	var finalResult = function(err, results) {
		var deltaS = threadTimer.deltaInSeconds();
		console.log('all thingers done',deltaS);
		console.log('stats', JSON.stringify({
			th: nThreads,
			n: stats.length,
			μ: stats.μ().toFixed(4)+' ms/req',
			σ: stats.σ().toFixed(4)+' ms/req',
			τ: (stats.length/deltaS).toFixed(2)+' req/s'
		}));
	};
	var tasks = [];
	for (var i = 0; i < nThreads; i++) {
		tasks.push(oneThread("t" + i));
	};
	async.parallel(tasks, finalResult);
}

manyThreads(threads);