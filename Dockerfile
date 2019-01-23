FROM node:9.3

LABEL maintainer="zybron <zybron@gmail.com>"

USER root

ENV APP /usr/src/app

RUN npm install pm2 -g

RUN mkdir -p $APP
COPY main.js $APP/main.js
COPY config.json $APP/data/config.json
COPY package.json $APP/package.json

RUN npm install --loglevel=warn

WORKDIR $APP

CMD [ "pm2-runtime", "main.js" ]