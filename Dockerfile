FROM node:20-alpine
WORKDIR /app

# Kopiere package.json
COPY package*.json ./

# Mount an zwei Stellen gleichzeitig (Arbeitsverzeichnis UND Root-Home)
RUN --mount=type=secret,id=npmrc,target=/app/.npmrc \
    --mount=type=secret,id=npmrc,target=/root/.npmrc \
    npm install

# Erst JETZT den restlichen Code kopieren (minus .npmrc wegen .dockerignore)
COPY . .
RUN npm run build

RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]