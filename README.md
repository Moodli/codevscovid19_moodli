# codevscovid19_moodli_backend

Backend for Moodli

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
```

## File Structure

### Deployment:

#### Requires:

1. Node (LTS)
2. NPM
3. PM2 (Install via NPM)
4. Server SSH KEY

```javascript
//Initialize the Remote Folder:
//Syntax: pm2 deploy <configuration_file> <environment> setup
//Example:
pm2 deploy ecosystem.js development setup

//Deploy your code:
//Syntax: pm2 deploy ecosystem.json development
//Example:
pm2 deploy ecosystem.json development
```
