FROM node:13

WORKDIR /usr/src/app

COPY bot /usr/src/app

RUN npm install

CMD ["node", "app.js"]