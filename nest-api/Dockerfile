FROM node:lts as builder

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .
COPY . /usr/src/app

RUN yarn build

FROM node:lts-slim

ENV NODE_ENV production
USER node

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies

COPY package.json yarn.lock ./

RUN yarn install --production --frozen-lockfile

COPY --from=builder /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]