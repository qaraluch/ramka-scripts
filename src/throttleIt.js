const throat = require("throat");
//[ForbesLindesay/throat: Throttle a collection of promise returning functions](https://github.com/ForbesLindesay/throat)

function throttleIt(job, concurrencyValue = 2) {
  return async function(jobArgs) {
    const results = await Promise.all(
      jobArgs.map(throat(concurrencyValue, job))
    );
    return results;
  };
}

module.exports = {
  throttleIt
};
