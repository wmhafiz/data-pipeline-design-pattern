FROM node:latest

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app/
RUN yarn install && yarn cache clean
COPY . /app

CMD ["yarn", "start"]
