FROM node:14-alpine3.10

RUN mkdir /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node package*.json ./

USER node
RUN npm install && npm cache clean --force --loglevel=error

COPY --chown=node:node . .

CMD [ "npm", "run", "dev" ]
