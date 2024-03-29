# build environment
FROM node:16.9.1-alpine as build
LABEL maintainer="fg-web@samfundet.no"

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/package.json
RUN npm i npm -g
RUN npm install
# Fixes "could not get uid/guid error (https://stackoverflow.com/questions/52196518/could-not-get-uid-gid-when-building-node-docker)
RUN npm config set unsafe-perm true
RUN npm install react-scripts@4.0.3 -g --silent
COPY . /app
RUN npm run build

# production environment
FROM nginx:1.19.6-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

