'use strict';
/*eslint-env node*/

//Dependencies
const cache = require('memory-cache');
let memCache = new cache.Cache();

//Define the middleware
let cacheMiddleware = (duration) => {
    return (req, res, next) => {
        let key = 'data:' + req.originalUrl || req.url;
        //Searech cache using the key
        let cacheContent = memCache.get(key);
        //If the corresponding cache exists
        if (cacheContent) {
            //Send the cache
            res.send(cacheContent);
            return;
        } else {
            //Otherwise send the new content and cache it
            res.sendResponse = res.send;
            res.send = (body) => { //res.send or res.json
                memCache.put(key, body, duration);
                res.sendResponse(body);
            };
            next();
        }
    };
};

module.exports = { cacheMiddleware };
