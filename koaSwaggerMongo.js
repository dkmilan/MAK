var mak = require('./core/app'),
    mongoose = require('mongoose');


var handleError = err => {
    console.log(err);
}
mak.start(function(app) {

    Schema = mongoose.Schema

    var swagger = require('./swagger.json');
    var dbType = {
        number: 'Number',
        integer: 'Number',
        string: 'String',
        boolean: 'Boolean'
    }

    for (var modelName in swagger.definitions) {
        var model = swagger.definitions[modelName];
        if (model.properties._id) {
            var refIdType = model.properties._id.type;
            dbType[modelName] = {
                type: dbType[refIdType],
                ref: modelName
            };
        }
    }
    console.log(dbType);
    for (var modelName in swagger.definitions) {
        console.log(modelName);
        var model = swagger.definitions[modelName];
        var dbModel = {};
        var properties = model.properties;
        for (var propName in properties) {
            var prop = properties[propName];

            var type = prop.type;
            if (type === 'array') {
                var itemType = prop.items.type ? prop.items.type : prop.items.$ref.substr(14)

                dbModel[propName] = [dbType[itemType]];
            } else {

                if (!type) {
                    type = prop.$ref.substr(14);
                }
                dbModel[propName] = dbType[type];
            }

            console.log('-' + propName + ':' + type);
        }
        console.log(dbModel);

        var schema = Schema(dbModel);

        mongoose.model(modelName, schema);
    }

    var User = mongoose.model('User');
    User.find({}, (err, records) => {
        if (records) {
            User.remove({}, (err) => {
                console.log(records.length + 'removed!');
            })
        }

        var person0 = new User({
            _id: 'a473434',
            name: 'test1'
        });
        person0.save(function(err) {
            if (err) return handleError(err);
        });
        var person1 = new User({
            _id: 'a000111',
            name: 'test1'
        });
        person1.save(function(err) {
            if (err) return handleError(err);
        });

        var Idea = mongoose.model('Idea');
        Idea.find({}, (error, records)=>{
            if (records) {
                Idea.remove({}, (err) => {
                    console.log(records.length + 'removed!');
                })
            }
            var idea1 = new Idea({
                _id : 0,
                name:'first idea',
                description: 'very first idea',
                author: person0
            })
            idea1.save(function(err) {
                if (err) return handleError(err);
            });
            var idea2 = new Idea({
                _id : 1,
                name:'another idea',
                description: 'test idea',
                author: person1
            })
            idea2.save(function(err) {
                if (err) return handleError(err);
            });
        })
    });

    var router = require('./route')();
    app.use(async function(ctx, next) {
        const start = new Date();
        await next()
        const ms = new Date() - start;
        console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
    });

    app.use(router.routes());
    app.use(router.allowedMethods());
});
