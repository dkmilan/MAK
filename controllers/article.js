var mongoose = require('mongoose'),
    Idea = mongoose.model('Idea'),
    Article = mongoose.model('Article'),
    Comment = mongoose.model('Comment'),
    User = mongoose.model('User');

function populateArticle(query){
    return query
    // .populate({
    //     path: 'comments.author',
    //     model: 'User'
    // })
    .populate('author');
}
function findArticleById(ctx) {
    return Article.findOne({ id: ctx.params.articleId });
}

module.exports.get = async (ctx, next) => {
    var article = await populateArticle(findArticleById(ctx)).exec();
    ctx.body = article;
}

module.exports.del = async (ctx, next) => {
    var deleted = await Article.findOneAndRemove({
        id: ctx.params.articleId,
        author: ctx.session.user
    }).exec();
    console.log(deleted._id)
    console.log(typeof deleted._id)
    ctx.body = await Idea.findOneAndUpdate(
        { id: ctx.params.ideaId },
        { $pull: { articles: deleted._id}},
        {new : true}
    ).exec();
}
module.exports.new = async (ctx, next) => {
    if (ctx.request.fields && ctx.session.user) {

        var requestData = ctx.request.fields;
        requestData.author = ctx.session.user;
        var newArticle = new Article(requestData);
        newArticle = await newArticle.save();
        //save to idea and return
        Idea.findOneAndUpdate(
            { id: ctx.params.ideaId },
            { $push: { "articles": newArticle} },
            { upsert : true, new : true }
        ).exec();
        ctx.body = newArticle;
    }
}

module.exports.newComment = async (ctx, next) => {
    if (ctx.request.fields && ctx.session.user) {
        var requestData = ctx.request.fields;
        requestData.author = ctx.session.user;

        var article = await populateArticle(
            Article.findOneAndUpdate(
                { id: ctx.params.articleId },
                { $push: { "comments": new Comment(requestData) } },
                {upsert:true, new : true}
            )
        ).exec();
        ctx.body = article;
    }
}


module.exports.delelteComment = async (ctx, next) => {
    if (ctx.session.user) {
        var commentId = new mongoose.Types.ObjectId(ctx.params.commentId);
        var userId = new mongoose.Types.ObjectId(ctx.session.user._id);

        var article = await populateArticle(
            Article.findOneAndUpdate(
                { id: ctx.params.articleId },
                {
                    $pull: {
                        comments: {_id: commentId, author: userId}
                    }
                },
                {new : true}
            )
        ).exec();
        console.log(article);
        ctx.body = article;
    }
}
