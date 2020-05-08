/*eslint-env node*/
'use strict';
module.exports = {
    apps: [{
        name: 'moodliBackend',
        script: 'app.js',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '5G',
        exec_mode: 'fork',
        env: {
            NODE_ENV: 'development'
        },
        env_production: {
            NODE_ENV: 'production'
        }
    }],
};