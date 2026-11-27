FROM node:16

RUN mkdir -p /usr/src/api
WORKDIR /usr/src/api

COPY package*.json ./

# Fix install permissions for "sharp"
RUN chown root:root .
RUN npm install

COPY . .

RUN chmod +x ./bin/boot-app.sh

CMD ["/usr/src/api/bin/boot-app.sh"]
