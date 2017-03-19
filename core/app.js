var mongoose = require('mongoose'),
    chalk = require('chalk')
    Koa = require('koa');
    config = require('./config');

module.exports.init = function init(callback) {
    mongoose.Promise = config.db.promise;
    var db = mongoose.connect(config.db.uri, config.db.options, function(err) {
        // Log Error
        if (err) {
            console.error('Could not connect to MongoDB!');
            console.log(err);
        } else {
            var app = new Koa();
            app.use(function (ctx, next) {
              const start = new Date();
              next().then(()=>{
                  const ms = new Date() - start;
                  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
              });
            });
            callback(app, db, config)
        }
    });
};

module.exports.start = function start(callback) {
    var that = this;

    that.init(function(app, db, config) {

        // Start the app by listening on <port> at <host>
        app.listen(config.port, config.host, function() {
            // Create server URL
            var server = (process.env.NODE_ENV === 'secure' ? 'https://' : 'http://') + config.host + ':' + config.port;
            // Logging initialization
            console.log('--');
            console.log(chalk.green('Server:          ' + server));
            console.log(chalk.green('Database:        ' + config.db.uri));
            console.log('--');

            if (callback) callback(app, db, config);
        });

    });

};
