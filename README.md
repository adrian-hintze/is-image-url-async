# is-image-url-async

Checks to see if a URL points to an image.

## Usage

```
var isImageUrl = require('is-image-url-async');

isImageUrl(url, timeout)
    .then(result => console.log(result))
    .catch(error => console.error('Error.', error));
```
