FROM nginx:alpine
WORKDIR /usr/share/nginx
COPY . .
RUN rm -fr html && ln -sfn public html \
 && cp nginx.conf /etc/nginx/nginx.conf \
 && cp default.conf /etc/nginx/conf.d/default.conf \
 && chown -R nginx. .
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
