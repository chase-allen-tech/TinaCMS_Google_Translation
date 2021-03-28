const qs = require("querystring");
const http = require("https");

const translateText = async (text, src, tgt) => {
    return new Promise(function (resolve, reject) {
        const options = {
            "method": "POST",
            "hostname": "google-translate1.p.rapidapi.com",
            "port": null,
            "path": "/language/translate/v2",
            "headers": {
                "content-type": "application/x-www-form-urlencoded",
                "accept-encoding": "application/gzip",
                "x-rapidapi-key": "90fddbf257msh8e76342fa71c5c3p1945b8jsn55fd95551707",
                "x-rapidapi-host": "google-translate1.p.rapidapi.com",
                "useQueryString": true
            }
        };

        const req = http.request(options, function (res) {
            const chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function () {
                const body = Buffer.concat(chunks);
                // console.log(body.toString());
                resolve(body.toString());
            });

            req.on('error', function (err) {
                // Second reject
                reject(err);
            });
        });

        req.write(qs.stringify({ q: text, source: src, target: tgt }));
        req.end();
    }).then(function (data) {
        return data;
    }).catch(function (err) {
        return err;
    });

}

export { translateText }