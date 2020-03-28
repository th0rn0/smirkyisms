FROM node:13

WORKDIR /usr/src/app

COPY api /usr/src/app

RUN npm install pm2 -g

RUN npm install

CMD ["node", "app.js", "--prod"]


# FROM node:lts-alpine as build-stage
# WORKDIR /app
# COPY server/package*.json ./
# RUN npm install
# COPY server .
# RUN npm run build

# # production stage
# FROM nginx:stable-alpine as production-stage
# COPY --from=build-stage /app/dist /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]