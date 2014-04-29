var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;
numCPUs = Math.min(numCPUs,2);

var total=0;
if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('online', function(worker) {
    console.log('worker ' + worker.process.pid + ' online');
  });
  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
    // Replace the dead worker,
    // we're not sentimental
    cluster.fork();
  });
} else {
  // Workers can share any TCP connection
  // In this case its a HTTP server
  console.log('I am worker #' + cluster.worker.id);
  http.createServer(function(req, res) {
    total+=1;
    if (total%1000 == 0){
      console.log(cluster.worker.id,'count',total);
    }
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({now:new Date(),thread:cluster.worker.id,total:total}));
  }).listen(8000);
}