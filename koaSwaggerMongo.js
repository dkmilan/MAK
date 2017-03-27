var koa = require('./core/koa'),
    mongoose = require('mongoose'),
    session = require('koa-session'),
    body = require('koa-better-body'),
    serve = require('koa-static'),
    config = require('./core/config'),
    Sequence = require('./sequence/Sequence'),
    SwaggerModel = require('./swagger/SwaggerModel');
    YAML = require('yamljs');


var handleError = err => {
    console.log(err);
}
koa.start(async function(app) {
    var swaggerModel = new SwaggerModel('./swagger.yaml');
    var sequenceModel = new Sequence();
    var IdeaSchema = swaggerModel.getModels()["Idea"];

    var ArticleSchema = swaggerModel.getModels()["Article"];
    sequenceModel.register(IdeaSchema, "Idea", "id");
    sequenceModel.register(ArticleSchema, "Article", "id");
    swaggerModel.registerAll();

    app.keys = ['UaN2B8pPqNwsKkf9oCyzT'];

    var router = require('./route')();
    app.use(async function(ctx, next) {
        const start = new Date();
        await next()
        const ms = new Date() - start;
        console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
    });


    app.use(session(config.session, app));
    app.use(body());
    app.use(async function(ctx, next){
        var list = ['/api/user/login', '/login.html'];
        if (ctx.session.isNew) {
            var needAuth = !(list.includes(ctx.url));
            console.log('needAuth:' + needAuth);
        }else{
            console.log(ctx.session.user);
        }
        await next();
    })
    app.use(router.routes());
    app.use(router.allowedMethods());
    app.use(serve('./public'));

    //require('./createDummyData')();

});
