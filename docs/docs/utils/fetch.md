---
layout: docs
id: utils/fetch
title: Utils &rsaquo; Fetch
---

# Fetch
The fetch polyfill and the file download API are very much WIP.

## Ideal usage example
```js
import fetch, { parseJson, downloadFromUrl } from 'utils/fetch';

fetch(url, options)
  .then(parseJson)
  .then(data => {
    // Do stuff
  })
  .catch(e => {
    // Catch any errors
    log(e.message);
  });

downloadFile(url)
  .then(fileData => {
    // Do something
  })
  .catch(e => {
    // Catch any errors
    log(e.message);
  });
```