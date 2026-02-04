# build environment
FROM node:16.9.1-alpine as build
LABEL maintainer="fg-web@samfundet.no"

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/package.json
RUN npm i npm -g
RUN npm install
COPY . /app
RUN npm run build

# production environment
FROM nginx:1.19.6-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
