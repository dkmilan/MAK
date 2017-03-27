var mongoose = require('mongoose')
    User = mongoose.model('User');

function execQuery(query) {
    return function(fn) {
        query.exec(function(err, res) {
            if (err) return fn(err);
            fn(null, res);
        });
    }
}

module.exports.test = async function(ctx, next) {
    let n = ctx.session.views || 0;
    ctx.session.views = ++n;
    ctx.body = n + ' views';
}
module.exports.userList = async function(ctx, next) {
    var list = await User.find({}).exec();
    ctx.body = list;

}
module.exports.login = async function(ctx, next) {

    var username = ctx.request.fields.userName;
    var password = ctx.request.fields.password;
    var user = await User.findOne({corpId:username}).exec();
    if (user){
        ctx.session.user = user;
        ctx.body = 'welcome ' + ctx.session.user.name;
    }
    else {
        ctx.session = null;
        ctx.status = 401;
        ctx.body = 'Not Authorized';
    }

}
