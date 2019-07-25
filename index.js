
const request = require("request");
const fs = require("fs");
let argv = require('minimist')(process.argv.slice(2));
const root = process.cwd();

argv.conf = argv.conf || argv.config;

let conf = argv.conf ? argv.conf : 'local'
let envFile = root + `/../node_env.json`;
let config = {};
let envData = {};

let packageFile = require(root + '/package.json');

try {
    let str = fs.readFileSync(envFile);
    envData = JSON.parse(str);
} catch(e) {
    envData = {}
}

if(envData['USE_CONFIG']) {
    conf = envData['USE_CONFIG'];
    console.log("Local config:", conf);
} else {
    console.log("Local config from env:", conf);
}

let confFile = root + `/config/${conf}.json`;

try {
    let confStr = fs.readFileSync(confFile);
    config = JSON.parse(confStr);
} catch(e) {
    console.error('Не удалось прочитать конфиг', confFile);
}

const sync = function (server) {

    return new Promise(function(resolve, reject) {
        if (!server)
            return resolve(config);

        request.get({
            url: 'http://' + server + '/config/' + packageFile.name + '?env=' + conf,
            json: true,
            timeout: 5000
        }, function(err, resp, body) {
            if (err)
                return reject(err);
            if(resp.statusCode !== 200) {
                reject(JSON.parse(body));
            } else {
                console.log("Used remote config");
                resolve(JSON.parse(body));
            }
        })

    });

}

module.exports = config;
module.exports.sync = sync;