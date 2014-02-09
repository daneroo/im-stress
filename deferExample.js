var Benchmark = require('benchmark');
var request = require('request');
 
var suite = new Benchmark.Suite;
 
// add tests
suite.add('Calling cow api', {
    defer: true,
    fn: function(deferred) {
        request({
            url: 'http://cowsay.morecode.org/say',
            method: 'POST',
            form: { format: 'text', message: "Some message." }
        }, function(error, response, body) {
            deferred.resolve();
        });
    }
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