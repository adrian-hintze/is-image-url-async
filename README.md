# is-image-url-async

Checks to see if a URL points to an image and returns a string containing the appropiate extension.

[![npm package](https://nodei.co/npm/is-an-image-url.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/is-image-url-async/)

## Installation

npm:

`npm install is-image-url-async --save`


## Usage

```
var isImageUrl = require('is-image-url-async');

isImageUrl(url, timeout)
    .then(result => console.log(result))
    .catch(error => console.error('Error.', error));
```
