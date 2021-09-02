FROM node:14-alpine as node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ARG npm_build_script=prod

RUN npm run-script $npm_build_script

FROM nginx

RUN apt-get update && apt-get install jq -y

COPY --from=node /usr/src/app/dist/core-ui /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY ui-runtime-env-config.sh ui-runtime-env-config.sh

CMD ./ui-runtime-env-config.sh; nginx -g 'daemon off;'