#!/bin/sh
echo "window.appConfig = { API_ADDR: '${API_ADDR}', AUTH0_DOMAIN: '${AUTH0_DOMAIN}', AUTH0_CLIENT_ID: '${AUTH0_CLIENT_ID}', AUTH0_AUDIENCE: '${AUTH0_AUDIENCE}' } " >> /usr/share/nginx/html/config.js
cat /usr/share/nginx/html/config.js
nginx -g "daemon off;" ${EXTRA_ARGS}