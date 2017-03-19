var mak = require('./core/app'),
    mongoose = require('mongoose');
require('./models/idea');
var Person = mongoose.model('Person'),
    Idea = mongoose.model('Idea');

mak.start(function(app) {
    var appRouters = require('./route');
    appRouters(app);

    Person.find({}, (err, records) => {
        if (records) {
            Person.remove({}, (err) => {
                console.log(records.length + 'removed!');
            })
        }

        var person0 = new Person({
            _id: 0,
            name: 'test'
        });
        person0.save(function(err) {
            console.log('saved !');
            if (err) return handleError(err);
        });
        var person1 = new Person({
            _id: 1,
            name: 'test1'
        });
        person1.save(function(err) {
            console.log('saved !');
            if (err) return handleError(err);
        });
        var person2 = new Person({
            _id: 2,
            name: 'test2'
        });
        person2.save(function(err) {
            console.log('saved !');
            if (err) return handleError(err);
        });
        Idea.remove({}, () => {
            var idea1 = new Idea({
                name: 'test Idea1',
                _creator: person0._id
            });

            var idea2 = new Idea({
                name: 'test Idea2',
                _creator: person2._id
            });

            idea1.save();
            idea2.save();
        });
    });
});