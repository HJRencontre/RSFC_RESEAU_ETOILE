FROM nginx

RUN rm /usr/share/nginx/html/*

RUN apt-get update && apt-get -y upgrade

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]