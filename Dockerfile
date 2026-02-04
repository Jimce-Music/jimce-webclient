FROM node:20-alpine
WORKDIR /app

# Nur Package-Dateien kopieren für besseres Caching
COPY package*.json ./

# Secret mounten und installieren
RUN --mount=type=secret,id=npmrc,target=/app/.npmrc \
    npm install

# Erst JETZT den restlichen Code kopieren (minus .npmrc wegen .dockerignore)
COPY . .
RUN npm run build

RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]