# Build Stage
FROM node:lts-alpine as build-stage

WORKDIR /app

COPY client/package*.json ./

RUN npm install

COPY client .

RUN npm run build

# Production stage
FROM nginx:stable-alpine as production-stage

COPY docker/client/root/ /

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["/run/entrypoint.sh"]