'use strict';

const http = require('http');
const https = require('https');
const urlLib = require('url');
const imageType = require('image-type');
const isUrl = require('is-url');

function requestUrlAndLookForImageHeader(url, timeout) {
    return new Promise((resolve, reject) => {
        const urlObj = new urlLib.URL(url);
        if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
            return reject(`Unsupported protocol ${urlObj.protocol}.`);
        }

        const protocol = urlObj.protocol === 'http:' ? http : https;
        protocol.get(url, { timeout }, (res) => {
            res.once('data', (chunk) => {
                res.destroy();

                const imgInfo = imageType(chunk);
                if (!imgInfo) {
                    return resolve();
                }

                resolve(imgInfo.ext);
            });
        }).on('error', error => reject(error));
    });
}

async function isImageUrl(url, timeout) {
    if (!url) {
        return;
    }

    if (!isUrl(url)) {
        return;
    }

    timeout = timeout ? timeout : 20*1000;
    return await requestUrlAndLookForImageHeader(url, timeout);
}

module.exports = isImageUrl;
