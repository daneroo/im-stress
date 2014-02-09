# im-stress
Stress test tool like ab (apache bench)

The use case I want to address, is stress testing a web api.

Would like to specify the number of threads, requests (total or per thread), and specify the url (or function producing url).

* The url may be a function returning url.
* The termination criterion could be time, instead of number of requests.
* How about tests!
* use async (or Q (promises))
* throttling
* measure throughput (incremental and global)
* dead periods ina scenario
* cluster workers for client ? compare with ab.

Make sure our iteration function never produces errors for the sake of async's loops.

Try server cluster w/ 2 CPUS, and threadCount 2 on dirac.

	NODE_DEBUG=cluster node server.js

## Notes

[While loop with promises](http://stackoverflow.com/questions/17217736/while-loop-with-promises)