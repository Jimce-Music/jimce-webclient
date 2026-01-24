FROM node:20-alpine

WORKDIR /app

COPY . .

RUN --mount=type=secret,id=NPM_TOKEN \
    export NPM_TOKEN=$(cat /run/secrets/NPM_TOKEN) && npm install

RUN npm install

RUN npm run build

RUN npm install -g serve
EXPOSE 4003
CMD ["serve", "-s", "dist", "-l", "4003"]
