# im-stress
Stress test tool like ab (apache bench)

The use case I want to address, is stress testing a web api.

Would like to specify the number of threads, requests (total or per thread), and specify the url (or function producing url).

* The url may be a function returning url.
* The termination criterion could be time, instead of number of requests.
* How about tests!
* use async or Q (promises)

## Notes

[While loop with promises](http://stackoverflow.com/questions/17217736/while-loop-with-promises)