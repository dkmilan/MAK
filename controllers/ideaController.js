var mongoose = require('mongoose'),
    Person = mongoose.model('Person'),
    Idea = mongoose.model('Idea');

function execQuery(query) {
    return function(fn) {
        query.exec(function(err, res) {
            if (err) return fn(err);
            fn(null, res);
        });
    }
}

module.exports.list = function*(ctx) {
    console.log("LIST");
    ctx.body = yield Idea.find({}).exec();
    console.log("LIST2");
}
