FROM node:22-alpine

LABEL maintainer="zybron <zybron@gmail.com>"

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --loglevel=warn

COPY main.js utils.js ./
COPY commands ./commands

USER node

CMD [ "node", "main.js" ]
