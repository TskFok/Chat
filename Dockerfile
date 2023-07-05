FROM node:20.2.0-bullseye-slim

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 9934

CMD [ "npm", "run", "dev", "--", "--port=9934" ]