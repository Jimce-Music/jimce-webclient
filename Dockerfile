FROM node:20-alpine
WORKDIR /app

# Kopiere package.json
COPY package*.json ./

# Wir bauen die .npmrc direkt im RAM während des Installs zusammen
RUN --mount=type=secret,id=npmrc_token \
    export TOKEN=$(cat /run/secrets/npmrc_token) && \
    echo "@jimce-music:registry=https://npm.pkg.github.com" > .npmrc && \
    echo "//npm.pkg.github.com/:_authToken=$TOKEN" >> .npmrc && \
    npm install && \
    rm .npmrc

# Erst JETZT den restlichen Code kopieren (minus .npmrc wegen .dockerignore)
COPY . .
RUN npm run build

RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]