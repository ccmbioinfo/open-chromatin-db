FROM node:carbon
RUN apt-get update && apt-get install -y tabix
RUN bash -c 'mkdir -p /usr/src/{app,data}'
WORKDIR /usr/src/app
COPY package.json /usr/src/app
COPY yarn.lock /usr/src/app
RUN yarn install
COPY . /usr/src/app
EXPOSE 3001
CMD ["yarn","start"]

