const mongoose = require('mongoose');

const CounterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

const UrlSchema = new mongoose.Schema({
    _id: { type: Number },
    url: { type: String },
    created_at: { type: Date, default: Date.now },
    clicks: { type: Number, default: 0 }
})


UrlSchema.pre('save', function (next) {
    var doc = this;
    Counter.findByIdAndUpdate({ _id: 'url_count' }, { $inc: { seq: 1 } }).exec((err, counter) => {
        if (err) return next(err);
        console.log("PRE-SAVE")
        console.log(doc);
        doc._id = counter.seq;
        next();
    });
});



const Counter = mongoose.model('counter', CounterSchema);
const URL = mongoose.model('url', UrlSchema);

module.exports = {
    Counter: Counter,
    URL: URL
}