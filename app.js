const express = require('express'),
    exphbs = require('express-handlebars'),
    btoa = require('btoa'),
    dateformat = require('dateformat'),
    bodyParser = require('body-parser'),
    app = express(),
    mongoose = require('mongoose'),
    create_shorten_route = require('./routes/create-shorten.route'),
    Counter = require('./models/url').Counter,
    URL = require('./models/url').URL,
    visit_shorten_route = require('./routes/visit-shorten.route'),
    port = process.env.PORT || 3001;


//Db connection
mongoose.connect('mongodb://localhost/shorten-url')
    .then(() => {
        console.log("Shorten-url db connected successfully..!");
        /*
        Counter.remove({}, function () {
            console.log("COUNTER cleared..!")
        });

        URL.remove({}, function(){
            console.log("URLs cleared..!")
        });
        */

        Counter.findOne({}, (err, counter) => {
            if (err) throw err;
            console.log(`Counter found ${counter}`);
            if (!counter) {
                Counter.create({ _id: 'url_count', seq: 10000 }).then(() => {
                    console.log(" Counter has been created..!");
                })
            }
        })
    })
    .catch((err) => { console.error(err) })
//helpers
const hbs = exphbs.create({
    defaultLayout: 'main',
    helpers: {
        decodeUrl: function (url) {
            return decodeURIComponent(url);
        },
        shortenURL: function (str) {
            return btoa(str);
        },
        parseDate: function(date){
            return dateformat(date);
        }
    }
});
//View Engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

//static
app.use(express.static('public'));

//body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 'extended': 'false' }));


app.get("/", (req, res) => {
    URL.find({}).sort({created_at: 'desc'}).exec().then((data) => {
        const host = `${req.protocol}://${req.hostname}:${port}/`;
        res.render('home', { urls: data, host:host });
    })
});

app.use("/short", create_shorten_route);
app.use('/', visit_shorten_route)


module.exports = app;