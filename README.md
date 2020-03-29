# codevscovid19_moodli_backend

Backend for Moodli

## API Doc: https://documenter.getpostman.com/view/4339786/SzYW2zTw?version=latest

## File Structure

```javascript
.
|-config => custom modules
| |-dbConnection.js => Module that handles MongoDB conection.
| |=logs.js => Custom loggers
|-creds =>  MongoDB Credentials
|-routes => API routes
| |-main.js => Test routes
|-app.js => Main app file
|-package.json => Contains app info. + dependencies
|-README.md
|-ecosystem.config.js => Deployment to run automatically and remotely by the VM [AWS]
|-ecosystem.json => Deployment script to run locally to deploy the app [AWS]
|-twiter.data => twitter data sample
```

## File Structure

### Deployment:

#### Requires:

##### Local:

1. Node (LTS)
2. NPM
3. PM2 (Install via NPM)
4. Server SSH KEY

##### Server:

1. Node (LTS)
2. NPM
3. PM2 (Install via NPM)
4. Git
5. /var/www/\* must be owned not by root but the default [or specified user]
6. MongoDB
7. Credentials (API KEY)
8. The ML's Script Path is realtive to the location of which it's being called. [childSpawn / or manually using python3]

```javascript
//Initialize the Remote Folder:
//Syntax: pm2 deploy <configuration_file> <environment> setup
//Example:
pm2 deploy ecosystem.json development setup

//Deploy your code:
//Syntax: pm2 deploy ecosystem.json development
//Example:
pm2 deploy ecosystem.json development
```
