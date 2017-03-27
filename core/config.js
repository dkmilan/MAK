module.exports = {
    db: {
        uri: 'mongodb://localhost/MASK-dev',
        options: {
            user: '',
            pass: ''
        },
        // Enable mongoose debug mode
        debug: process.env.MONGODB_DEBUG || false,

        promise: global.Promise
    },
    port: process.env.PORT || 3000,
    host: process.env.HOST || '0.0.0.0',
    session: {
        key: 'koa:sess',
        /** (string) cookie key (default is koa:sess) */
        maxAge: 3600000,
        /** (number) maxAge in ms (default is 1 days) */
        overwrite: true,
        /** (boolean) can overwrite or not (default true) */
        httpOnly: true,
        /** (boolean) httpOnly or not (default true) */
        signed: true,
        /** (boolean) signed or not (default true) */
    }
}
