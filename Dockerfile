### Multistage build
# Base image
FROM node:lts-alpine AS BASE

# Switch the working directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN apk update && apk upgrade && apk add python3 && pip3 install --upgrade pip && pip3 install -U textblob geojson pandas redis &&npm i -g npm && npm i -g pm2@latest


### 2nd Stage: Install dependencies
FROM BASE AS DEPENDENCIES

# Install the dependencies => node_modules
RUN npm ci --production 

### 43rd Stage: Create the final image
FROM BASE AS RELEASE

# Copy node_modules [from DEDENCIES to RLEASE]
COPY --from=DEPENDENCIES /usr/src/app/node_modules ./node_modules

# Copy rest of the files [from local to RELEASE]
COPY . .



# Node module tweaks + Grant permission to non-root user
RUN cd nodeModuleconfig && chmod +x nodeCus.sh && ./nodeCus.sh && chown -R 1000:1000 /usr/src/app

# Run the service with non-root user
USER 1000:1000

# Command to execute at the end, each parameters in an element in the array
CMD ["pm2-runtime", "start","pm2.json"]