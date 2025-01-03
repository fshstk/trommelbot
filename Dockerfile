FROM node:23 AS develop
RUN apt-get update && apt-get install -y ffmpeg && apt-get clean
USER node
ENTRYPOINT ["bash"]

FROM develop AS deploy
RUN mkdir /home/node/app
WORKDIR /home/node/app
COPY . ./
RUN npm ci
ENTRYPOINT ["npm", "start"]
