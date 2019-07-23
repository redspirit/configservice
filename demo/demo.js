

const confservice = require('../');


confservice.sync(null).then(function (config) {
    console.log('>>', config);
})


console.log(confservice);