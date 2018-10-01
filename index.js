'use strict';

const http = require('http');
const https = require('https');
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
        const protocol = urlObj.protocol === 'http' ? http : https;
        protocol.get(url, { timeout }, (res) => {
            res.once('data', (chunk) => {
                res.destroy();
                const ext = imageType(chunk);
                resolve(!!ext);
            });
        }).on('error', error => reject(error));
    });
}

function isUrlAnImageUrl(url, timeout) {
    return new Promise((resolve, reject) => {
        const urlObject = urlLib.parse(url);
        const path = urlObject.pathname;
        if (isImage(path)) {
            return resolve(true);
        }

        requestUrlAndLookForImageHeader(url, timeout)
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

function isImageUrl(url, timeout) {
    return new Promise((resolve, reject) => {
        if (!url) {
            return resolve(false);
        }

        if (!isUrl(url)) {
            return resolve(isImage(url));
        }

        isUrlAnImageUrl(url, timeout)
            .then(result => resolve(result))
            .catch(error => reject(error));
    });  
}

module.exports = isImageUrl;
