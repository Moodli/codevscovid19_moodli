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
