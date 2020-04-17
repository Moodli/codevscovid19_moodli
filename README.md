# codevscovid19_moodli_backend

Backend for Moodli

## Live Site:
### https://moodli.org

## API Doc:
### https://documenter.getpostman.com/view/4339786/SzYZ2epF?version=latest

## API Endpoint: 
### https://moodli.org:8443/geo

## File Structure

```javascript
.
|-config => Custom modules
| |-dbConnection.js => Module that handles MongoDB conection.
| |-logs.js => Custom loggers
| |-childSpawn.js => Run the mongoexport process & sentiment_model_english.py
| |-meCache.js => Memeory caching module
| |-textProcess.js => Pre-process text for ML + Geolocate tweets
|-creds =>  MongoDB & Twitter Credentials
|-mlModel => ML Folder
| |-sentiment_model_english.py => Model for english sentiment analysis
| |-tweets.csv => sample input model input, generated mongoexport in childSpawn.js
|-nodeModuleconfig => Files that replace some defaults in the node_modules floder
| |-data.json => node_modules/country-list/data.json
| |-stopwords_en.js => node_modules/stopword/lib/stopwords_en.js
| |-wordDict.js => node_modules/apos-to-lex-form/wordDict.js
| |-explain.txt => explains what you just read above
| |-nodeCus.sh => Automate the replacement
|-nonProduction => Misc. dev. stuff, not used in production.
|-productionData => sample output from sentiment_model_english.py
| |-dataset.json => [Do not delete, the route in routes/tweet.js needs it!]
|-routes => API routes
| |-tweet.js => Tweet stream analysis + render
|-schema => MondoDB Schema
| |-tweetSchema.js => Schema for storing processed tweets
|-app.js => Main app file
|-package.json => Contains app info. + dependencies
|-README.md => You are reading it now
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
8. Python3 and pip3
9. Python Library: textblob,geojson,pandas

Note: The ML's Script Path is realtive to the location of which it's being called. [childSpawn / or manually using python3]

```javascript
//Initialize the Remote Folder:
//Syntax: pm2 deploy <configuration_file> <environment> setup
//Example:
pm2 deploy ecosystem.json development setup

//Deploy your code:
//Syntax: pm2 deploy <configuration_file> development
//Example:
pm2 deploy ecosystem.json development

//Update your code:
pm2 deploy ecosystem.json development update
```
