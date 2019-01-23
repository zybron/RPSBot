FROM node:9.3

LABEL maintainer="zybron <zybron@gmail.com>"

USER root

ENV APP /usr/src/app

RUN npm install pm2 -g

COPY package.json /tmp/package.json

RUN cd /tmp && npm install --loglevel=warn \
  && mkdir -p $APP \
  && mv /tmp/node_modules $APP

COPY main.js $APP/main.js
COPY config.json $APP/config.json

WORKDIR $APP

CMD [ "pm2-runtime", "main.js" ]