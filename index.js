"use strict"

var Q = require('q');
var async = require('async');

var threads=2;

// inclusive
function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function thinger(a,cb){
	var delay=getRandomInt(10-20);
	setTimeout(function(){
		cb(null,a*2);
	},delay);
}

console.log('start');
thinger(21,function(err,res){
	console.log('thinger',res);
});
console.log('end');
