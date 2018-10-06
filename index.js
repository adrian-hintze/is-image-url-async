'use strict';

const http = require('http');
const https = require('https');
const path = require('path');
const urlLib = require('url');
const imageType = require('image-type');
const isImage = require('is-image');
const isUrl = require('is-url');

function requestUrlAndLookForImageHeader(url, timeout) {
    if (!timeout) {
        timeout = 20*1000;
    }

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

function isUrlAnImageUrl(url, timeout) {
    return new Promise((resolve, reject) => {
        const urlObj = new urlLib.URL(url);
        const pathname = urlObj.pathname;
        if (isImage(pathname)) {
            const ext = path.extname(pathname).substring(1);
            return resolve(ext);
        }

        requestUrlAndLookForImageHeader(url, timeout)
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

function isImageUrl(url, timeout) {
    return new Promise((resolve, reject) => {
        if (!url) {
            return resolve();
        }

        if (!isUrl(url)) {
            return resolve();
        }

        isUrlAnImageUrl(url, timeout)
            .then(result => resolve(result))
            .catch(error => reject(error));
    });  
}

module.exports = isImageUrl;
