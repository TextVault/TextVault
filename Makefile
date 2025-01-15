PORT:=3000
PYTHONPATH=./

REPOSITORY=ghcr.io/wtf-keaton/textvault
FRONTEND_VERSION=0.0.1-stage-frontend
BACKEND_VERSION=0.0.1-stage-backend
MIGRATIONS_VERSION=0.0.1-stage-backend-migrations
SWAGGER_VERSION=0.0.1-stage-swagger

FRONTEND_TAG=${REPOSITORY}:${FRONTEND_VERSION}
BACKEND_TAG=${REPOSITORY}:${BACKEND_VERSION}
MIGRATIONS_TAG=${REPOSITORY}:${MIGRATIONS_VERSION}
SWAGGER_TAG=${REPOSITORY}:${SWAGGER_VERSION}

TARGET=production-image
MIGRATIONS_TARGET=migrations-image

GID=$(shell id -g)
UID=$(shell id -u)

compose:
	docker compose -f infra/docker-compose.yaml up --build -d

build:
	docker build -t ${FRONTEND_TAG} --target ${TARGET} -f infra/frontend.Dockerfile frontend
	docker build -t ${BACKEND_TAG} --target ${TARGET} -f infra/backend.Dockerfile backend
	docker build -t ${MIGRATIONS_TAG} --target ${MIGRATIONS_TARGET} -f infra/backend.Dockerfile backend
	docker build -t ${SWAGGER_TAG} --target ${TARGET} -f infra/swagger.Dockerfile spec

deploy: build
	docker push ${FRONTEND_TAG}
	docker push ${BACKEND_TAG}
	docker push ${MIGRATIONS_TAG}
	docker push ${SWAGGER_TAG}

generate-server:
	docker compose -f ./ogen.yaml run --rm generate-server