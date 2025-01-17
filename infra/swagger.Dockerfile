FROM node:lts-alpine AS production-image
WORKDIR /usr/src
COPY ./tspconfig.yaml ./package.json ./
RUN npm install -g @typespec/compiler @scalar/cli && npm install --force
COPY ./main.tsp ./

RUN tsp compile main.tsp

CMD ["scalar", "serve", "./tsp-output/@typespec/openapi3/openapi.yaml", "--port", "8080"]
