<<<<<<< HEAD
FROM node:14-alpine3.10
=======
FROM node:16-alpine3.15

RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf

RUN mkdir /home/node/app && chown -R node:node /home/node/app
RUN mkdir /home/node/web && chown -R node:node /home/node/web

COPY --chown=node:node src/web/package*.json /home/node/web/
COPY --chown=node:node src/api/package*.json /home/node/app/

<<<<<<< HEAD
=======
RUN npm install -g npm@8.5.5
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
USER node

WORKDIR /home/node/app
RUN npm install && npm cache clean --force --loglevel=error
COPY --chown=node:node src/api/.env* ./

WORKDIR /home/node/web
<<<<<<< HEAD
RUN npm install && npm cache clean --force --loglevel=error

=======

RUN npm install && npm cache clean --force --loglevel=error
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
COPY --chown=node:node src/api /home/node/app/
COPY --chown=node:node src/web /home/node/web/

RUN npm run build:docker

EXPOSE 3000

WORKDIR /home/node/app

ENV NODE_ENV=production
#RUN npm install --platform=linux --arch=x64 sharp@0.29.1
RUN npm run build
CMD [ "node", "./dist/index.js" ]