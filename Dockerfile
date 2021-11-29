################################################################################
# Base Setup
################################################################################

FROM node:17

RUN apt update && apt install -y ffmpeg=7:4.3.*

USER node
RUN mkdir /home/node/app
WORKDIR /home/node/app


################################################################################
# Node
################################################################################

COPY package.json package-lock.json ./
RUN npm ci


################################################################################
# Bot
################################################################################

COPY . ./

ENTRYPOINT ["node", "index.js"]
