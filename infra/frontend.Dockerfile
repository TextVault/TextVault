### STAGE 1: Build ###
FROM node:lts-alpine AS builder
WORKDIR /usr/src
ENV PATH /usr/src/node_modules/.bin:$PATH
COPY package.json .
RUN npm install --silent
COPY . .
RUN npm run build

### STAGE 2: Production Environment ###
FROM nginx:alpine AS production-image
COPY --from=builder /usr/src/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]