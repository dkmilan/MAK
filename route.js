var Router = require('koa-router');
var ideaCtrl = require('./controllers/idea.js');
var userCtrl = require('./controllers/user.js');
var articleCtrl = require('./controllers/article.js');
module.exports = function() {
    var router = new Router();

    router.post('/api/*', async function(ctx, next) {
        var isValid = true;
        if (ctx.url !== '/api/user/login') {
            if (ctx.session.isNew) {
                isValid = false;
                ctx.status = 401;
                ctx.body = "Not Authorized";
            }
        }
        if (isValid) {
            await next();
        }

    })
    router.get('/api/idea', ideaCtrl.list);
    router.get('/api/idea/:id', ideaCtrl.get);
    router.post('/api/idea', ideaCtrl.newIdea);
    router.post('/api/idea/:id/comment', ideaCtrl.newComment);
    router.del('/api/idea/:id/comment/:commentId', ideaCtrl.delelteComment);
    router.post('/api/idea/:id/like', ideaCtrl.like);
    router.post('/api/idea/:id/unlike', ideaCtrl.unlike);
    router.post('/api/idea/:id/join', ideaCtrl.join);

    router.get('/api/idea/:ideaId/article/:articleId', articleCtrl.get);
    router.del('/api/idea/:ideaId/article/:articleId', articleCtrl.del);
    router.post('/api/idea/:ideaId/article', articleCtrl.new);
    router.post('/api/idea/:ideaId/article/:articleId/comment/', articleCtrl.newComment);
    router.del('/api/idea/:ideaId/article/:articleId/comment/:commentId', articleCtrl.delelteComment);

    router.get('/api/user', userCtrl.userList);
    router.get('/api/test', userCtrl.test);
    router.post('/api/user/login', userCtrl.login);
    return router;
}
