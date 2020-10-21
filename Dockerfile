FROM nginx:alpine

MAINTAINER m00ny | admin@m00net.de

COPY index.html /usr/share/nginx/html
COPY js /usr/share/nginx/html/js/
