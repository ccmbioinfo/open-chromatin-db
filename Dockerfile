FROM node:8.10.0
COPY package.json ./

RUN npm install

COPY . ./

ENV NODE_PATH=/node_modules

EXPOSE 3000
EXPOSE 3001
EXPOSE 3002

CMD [ "npm", "start" ]