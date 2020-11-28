# codevscovid19_moodli_backend

Backend for Moodli

## Badges

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/53edb3df323247c8be6188e7198c1828)](https://www.codacy.com/gh/Moodli/codevscovid19_moodli_backend?utm_source=github.com&utm_medium=referral&utm_content=Moodli/codevscovid19_moodli_backend&utm_campaign=Badge_Grade)[![Maintainability](https://api.codeclimate.com/v1/badges/fcac951a350d7fbb5fb7/maintainability)](https://codeclimate.com/github/Moodli/codevscovid19_moodli_backend/maintainability)
[![](https://img.shields.io/github/issues/Moodli/codevscovid19_moodli_backend)]()
[![](https://img.shields.io/github/stars/Moodli/codevscovid19_moodli_backend)]()
[![](https://img.shields.io/github/license/Moodli/codevscovid19_moodli_backend)]()

## Live Site:

### https://moodli.org

## API Doc:

### https://documenter.getpostman.com/view/4339786/SzYZ2epF?version=latest

## API Endpoint:

### https://moodli.org/geo

### Requirements:

1. Node (LTS)
2. NPM
3. PM2 (Install via NPM)
4. Git
5. /var/www/\* must be owned not by root but the default [or specified user]
6. MongoDB (default creds)
7. Redis (default creds)
8. Twitter API Keys
9. Python3 and pip3
10. Python Library: textblob,geojson,pandas,redis (except for textblob, rest of the package can be installed via apt)

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
