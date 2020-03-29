FROM node:13

WORKDIR /usr/src/app

COPY api /usr/src/app

RUN npm install pm2 -g

RUN npm install

ENTRYPOINT ["pm2-runtime"]
CMD ["app.js", "--prod "]
