/*eslint-env node*/
'use strict'
module.exports = {
    apps: [{
        name: 'moodliBackend',
        script: 'app.js',
        instances: 0,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        exec_mode: 'cluster',
        env: {
            NODE_ENV: 'development'
        },
        env_production: {
            NODE_ENV: 'production'
        }
    }],
};