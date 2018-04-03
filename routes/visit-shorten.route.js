const express = require('express'),
    router = express.Router(),
    URL = require('../models/url').URL,
    atob = require('atob');

router.get('/:url', (req, res, next) => {
    if (!req.params.url) return next();

    URL.findByIdAndUpdate(atob(req.params.url), { $inc: { clicks: 1 } }, function (err, data) {
        if (err) res.send(err);
        console.log(`data-clicks: ${data.clicks}`);
        res.redirect(decodeURIComponent(data.url));
    })
});

module.exports = router;