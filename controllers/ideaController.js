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

module.exports.list = async function (ctx, next) {
    console.log("LIST");
    var list = await Idea.find({}).exec();
    ctx.body = list;
    // yield Idea.find({}).exec().then((list)=>{
    //
    //     console.log("LIST2");
    //     console.log(list);
    //     this.body=list;
    // });
    console.log("LIST3");
    console.log(ctx.body);
}
