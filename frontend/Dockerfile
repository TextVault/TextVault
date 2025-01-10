FROM node:20.10.0-buster-slim

WORKDIR /app

ENV TEXTVAULT_BACKEND_URL=http://localhost:8080

COPY package.json package-lock.json* next.config.js tsconfig.json ./

RUN npm ci

COPY . ./

RUN NODE_OPTIONS="--max-old-space-size=2048" npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]