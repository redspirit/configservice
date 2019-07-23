
const request = require("request");
const fs = require("fs");
const querystring = require("querystring");
let argv = require('minimist')(process.argv.slice(2));
const root = process.cwd();

let conf = argv.conf ? argv.conf : 'local'
let confFile = root + `/config/${conf}.json`;
let config = {};

let packageFile = require(root + '/package.json');

try {
    let confStr = fs.readFileSync(confFile);
    config = JSON.parse(confStr);
} catch(e) {
    console.error('Не удалось прочитать конфиг', confFile);
}


const sync = function (serverUrl) {

    return new Promise(function(resolve, reject) {
        if (!serverUrl)
            return resolve(config);

        request.get({
            url: serverUrl + '?' + querystring({name: packageFile.name}),
            json: true
        }, function(err, resp, body) {
            if (err)
                return reject(err);
            if(resp.statusCode !== 200) {
                reject(JSON.parse(body));
            } else {
                resolve(JSON.parse(body));
            }
        })

    });

}

module.exports = config;
module.exports.sync = sync;