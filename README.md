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
#### Development
- Configure Twitter's API credentials in the `cred.env` file in the `creds` folder
- You can use `cred.env.example` as a reference 
#### Docker
- Configure `docker.env` in the project's root directory
- You can use `docker.env.example` as a reference 
- 
### Start:
#### Development
```bash
npm i && npm start
```
#### Docker
```bash
# Build the images
docker-compose --env-file=docker.env build
# Start the stack
docker-compose --env-file=docker.env up
```

