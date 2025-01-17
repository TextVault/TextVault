### STAGE 1: Build ###
FROM node:lts-alpine AS builder
WORKDIR /usr/src
ENV PATH /usr/src/node_modules/.bin:$PATH
COPY package.json .
RUN npm install --silent
COPY . .
RUN npm run build

### STAGE 2: Production Environment ###
FROM caddy:latest AS production-image

COPY --from=builder /usr/src/dist /usr/share/caddy/html

RUN echo ":80 {" > /etc/caddy/Caddyfile
RUN echo "    encode zstd gzip" >> /etc/caddy/Caddyfile
RUN echo "    root * /usr/share/caddy/html" >> /etc/caddy/Caddyfile
RUN echo "    file_server" >> /etc/caddy/Caddyfile
RUN echo "    try_files {path} /index.html" >> /etc/caddy/Caddyfile
RUN echo "}" >> /etc/caddy/Caddyfile

EXPOSE 80