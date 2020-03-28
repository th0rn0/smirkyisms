# FROM node:13

# WORKDIR /usr/src/app

# COPY client /usr/src/app

# RUN npm install

# CMD ["npm", "run", "serve"]


FROM node:lts-alpine as build-stage
WORKDIR /app
COPY client/package*.json ./
RUN npm install
COPY client .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY docker/client/root/ /
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["/run/start.sh"]