/*eslint-env node*/
if (process.env.NODE_ENV === 'production') {
    module.exports = {
        'Database': 'mongodb+srv://<username>:<passowrd>@cluster0-osoe0.mongodb.net/<db>?retryWrites=true&w=majority',
    };
} else {
    module.exports = {
        'Database': 'mongodb+srv://<username>:<passowrd>@cluster0-osoe0.mongodb.net/<db>?retryWrites=true&w=majority',
    };
}

