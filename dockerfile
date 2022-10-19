FROM node:alpine as development

WORKDIR /usr/src/app

COPY package*.json ./

# generated prisma files
COPY prisma ./prisma/

# COPY ENV variable
COPY .env ./

# COPY tsconfig.json file
COPY tsconfig.json ./

# COPY
COPY . .

RUN yarn install
RUN yarn prisma generate

RUN yarn prisma migrate deploy

EXPOSE 3000

CMD yarn start