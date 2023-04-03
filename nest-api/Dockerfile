FROM node:lts as builder

# Create app directory
USER root
RUN mkdir -p /usr/src/app
RUN chown node /usr/src/app
USER node
WORKDIR /usr/src/app

# Install app dependencies

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile
COPY . /usr/src/app

COPY . .

RUN yarn build

FROM node:lts-slim

ENV NODE_ENV production

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies

COPY package.json yarn.lock ./

RUN yarn install --production --frozen-lockfile
COPY . /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]