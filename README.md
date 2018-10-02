# is-image-url-async

Checks to see if a URL points to an image and returns a string containing the appropiate extension, or undefined if the URL does not point to an image.

[![npm package](https://nodei.co/npm/is-image-url-async.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/is-image-url-async/)

## Installation

npm:

`npm install is-image-url-async --save`


## Usage

Standard promises:

```
const isImageUrl = require('is-image-url-async');

isImageUrl(url, timeout)
    .then(ext => console.log(ext))
    .catch(error => console.error('Error', error));
```

Async function:

```
const isImageUrl = require('is-image-url-async');

async function foo(url, timeout) {
    try {
        const ext = await isImageUrl(url, timeout);
        console.log(ext);
    }
    catch (error) {
        console.error('Error', error);
    }
}
```
