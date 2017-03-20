
const router = require('koa-router')();
var ideaCtrl = require('./controllers/ideaController.js')
module.exports = function() {

    var ideas = [{
        id: '1',
        name: 'idea1',

    }, {
        id: '2',
        name: 'idea2'
    }]
    router.get('/api/idea', ideaCtrl.list);
    router.get('/api/idea/:id', async function (next) {
        var that = this;
        ideas.forEach((idea)=>{
            if (idea.id === this.params.id){
                this.body = idea;
                return false;
            }
        })
    })
    return router;
}
