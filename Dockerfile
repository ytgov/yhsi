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

RUN mkdir /home/node/app && chown -R node:node /home/node/app
RUN mkdir /home/node/web && chown -R node:node /home/node/web

COPY --chown=node:node web/package*.json /home/node/web/
COPY --chown=node:node api/package*.json /home/node/app/

RUN npm install -g npm@8.5.5
USER node

WORKDIR /home/node/app
RUN npm install && npm cache clean --force --loglevel=error
COPY --chown=node:node api/.env* ./

WORKDIR /home/node/web

RUN npm install && npm cache clean --force --loglevel=error
COPY --chown=node:node api /home/node/app/
COPY --chown=node:node web /home/node/web/

RUN npm run build:docker

EXPOSE 3000

WORKDIR /home/node/app

COPY api/templates /home/node/app/dist/templates

ENV NODE_ENV=production
#RUN npm install --platform=linux --arch=x64 sharp@0.29.1
RUN npm run build
CMD [ "node", "./dist/index.js" ]