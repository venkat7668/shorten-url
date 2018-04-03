const express = require('express'),
    mongoose = require('mongoose'),
    router = express.Router(),
    URL = require('../models/url').URL,
    btoa = require('btoa'),
    port = process.env.PORT || 3001;


router.post('/', (req, res, next) => {
    //check the URL if already exists
    //encodeURIComponent for security concern
    let encodeURL = encodeURIComponent(req.body.url);
    URL.findOne({ url: encodeURL}).exec().then((data) => {
        return data;

    }).then((URLdata) => {

        let host = `${req.protocol}://${req.hostname}:${port}/`;

        if (URLdata) {
            // if url found return the shortURL
            res.json({
                url: decodeURIComponent(URLdata.url),
                shortUrl: host + btoa(URLdata._id),
                exists:true
            });

        } else {
            // New URL create and return shortURL
            req.body.url = encodeURL;
            URL.create(req.body).then((data) => {
                res.json({
                    url: decodeURIComponent(data.url),
                    shortUrl: host + btoa(data._id),
                    exists:false
                });
            });
        }

    }).catch((err) => {
        //errror handeling
        res.status(500);
        res.json(err);
    });
})

module.exports = router;