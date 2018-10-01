'use strict';

const util = require('util');
const urlLib = require('url');
const request = require('request');
const isImage = require('is-image');
const isUrl = require('is-url');

const promisifiedGet = util.promisify(request.get);

function handleResponse(response) {
    return new Promise((resolve) => {
        if (!response || !response.headers) {
            return resolve(false);
        }

        const contentType = response.headers['content-type'];
        const hasImageContentType = contentType && contentType.search(/^image\//) !== -1;
        resolve(hasImageContentType);
    });
}

function requestUrlAndLookForImageHeader(url, timeout) {
    if (!timeout) {
        timeout = 20*1000;
    }

    return promisifiedGet(url, { timeout })
        .then(response => handleResponse(response));
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
    return new Promise((resolve) => {
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
