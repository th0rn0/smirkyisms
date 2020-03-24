FROM node:13

WORKDIR /usr/src/app

COPY client /usr/src/app

RUN npm install

CMD ["npm", "run", "serve"]