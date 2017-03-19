
const router = require('koa-route');
var ideaCtrl = require('./controllers/ideaController.js')
module.exports = function(app) {

    var ideas = [{
        id: '1',
        name: 'idea1',

    }, {
        id: '2',
        name: 'idea2'
    }]
    app.use(router.get('/api/idea', ideaCtrl.list));


    app.use(router.get('/api/idea/:id', (ctx,id)  => {
        ideas.forEach((idea)=>{
            if (idea.id === id){
                ctx.body = idea;
                return false;
            }
        })
    }))
}
