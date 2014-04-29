"use strict"

var async = require('async');
var Timer = require('../lib/im-timer.js').MiliTimer; // or NanoTimer

// invokerWrapper takes a function (and a callback for notification)
// and returns a new function, whose invocation will wrap the original with timing code
// but in other respects perform the same action
//
// functionUnderTest is the function we are timing
//  it takes a single callback paramter of the form callback(err,result) 
// onIteration will be invoker, with the timing info, as well as, error and result of the invocation
//
// so functionUnderTest(cb) becomes
//  invokerWrapper(functionUnderTest,onItHandler)(cb)

function invokerWrapper(functionUnderTest,onIteration){
	// reuse this timer to avoid constructor.
	var invocationTimer = new Timer();
	return function(callback) {
		// beforeInvoke(...)
		invocationTimer.reset();
		// actual invocation
		functionUnderTest(function(err, result) {
			var delta = invocationTimer.delta();
			if (onIteration) {
				onIteration(delta,err,result);
			}
			//  should I actually ignore errors, or the thread will stop.			
			//  by thread I mean it's use in async.whilst
			callback(err,result);
		});
	};
}

module.exports = exports = {
	invokerWrapper: invokerWrapper
};