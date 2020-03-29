#!/bin/sh
echo "window.appConfig = { API_ADDR: '${API_ADDR}'} " >> /usr/share/nginx/html/config.js
cat /usr/share/nginx/html/config.js
nginx -g "daemon off;" ${EXTRA_ARGS}