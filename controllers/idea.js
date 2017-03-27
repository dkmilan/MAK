var mongoose = require('mongoose'),
    Idea = mongoose.model('Idea'),
    Comment = mongoose.model('Comment'),
    User = mongoose.model('User');

function populateIdeaDetails(query){
    return query
    .populate({
        path: 'comments.author',
        model: 'User'
    })
    .populate({
        path: 'articles',
        populate: { path:  'author'}
    })
    .populate('likedBy')
    .populate('creator');
}
function findIdeaById(ctx) {
    return Idea.findOne({ id: ctx.params.id });
}

module.exports.list = async (ctx, next) => {
    ctx.body = await Idea.find({}).populate('creator').exec();
}


module.exports.get = async (ctx, next) => {
    ctx.body = await populateIdeaDetails(findIdeaById(ctx)).exec();
}

module.exports.newIdea = async (ctx, next) => {
    if (ctx.request.fields && ctx.session.user) {
        var requestData = ctx.request.fields;
        requestData.creator = ctx.session.user;
        var newIdea = new Idea(requestData);
        await newIdea.save();
        ctx.body = await Idea.find({}).exec();
    }
}

module.exports.newComment = async (ctx, next) => {
    if (ctx.request.fields && ctx.session.user) {
        var requestData = ctx.request.fields;
        requestData.author = ctx.session.user;
        var newComment = new Comment(requestData);

        var idea = await populateIdeaDetails(
            Idea.findOneAndUpdate(
                { id: ctx.params.id },
                { $push: { "comments": newComment} },
                {upsert:true, new : true}
            )
        ).exec();
        ctx.body = idea;
    }
}



module.exports.delelteComment = async (ctx, next) => {
    if (ctx.session.user) {
        var commentId = new mongoose.Types.ObjectId(ctx.params.commentId);
        var userId = new mongoose.Types.ObjectId(ctx.session.user._id);
        
        var idea = await populateIdeaDetails(
            Idea.findOneAndUpdate(
                { id: ctx.params.id },
                { $pull: { comments: {_id: commentId, author: userId}}},
                {new : true}
            )
        ).exec();

        ctx.body = idea;
    }
}

module.exports.like = async (ctx, next) => {
    var user = ctx.session.user;
    if (user) {
        var idea = await findIdeaById(ctx).exec();
        idea.likedBy.addToSet(user);
        ctx.body = await idea.save();
    }
}

module.exports.unlike = async (ctx, next) => {
    var user = ctx.session.user;
    if (user) {
        var idea = await findIdeaById(ctx).exec();
        idea.likedBy.remove(user);
        ctx.body = await idea.save();
    }
}

module.exports.join = async (ctx, next) => {
    var user = ctx.session.user;
    if (user) {
        var idea = await findIdeaById(ctx).exec();
        idea.teamMembers.addToSet(user);
        ctx.body = await idea.save();
    }
}
