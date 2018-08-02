FROM node:carbon
RUN apt-get update && apt-get install -y tabix
RUN bash -c 'mkdir -p /usr/src/{app,data}'
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN npm install
COPY . /usr/src/app
EXPOSE 3001
CMD ["npm","start"]

