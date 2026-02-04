FROM node:20-alpine
WORKDIR /app

# Kopiere package.json
COPY package*.json ./

# Wir übergeben den Token direkt als Build-Argument/Secret in die Umgebung
RUN --mount=type=secret,id=npmrc_token \
    NODE_AUTH_TOKEN=$(cat /run/secrets/npmrc_token) \
    npm config set //npm.pkg.github.com/:_authToken ${NODE_AUTH_TOKEN} && \
    npm config set @jimce-music:registry https://npm.pkg.github.com && \
    npm install

# Erst JETZT den restlichen Code kopieren (minus .npmrc wegen .dockerignore)
COPY . .
RUN npm run build

RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]