air:
	air -c .air.toml

sql-gen:
	sqlc generate -f sqlc.yaml

migrate-up:
	go run ./cmd/migration/main.go up

migrate-down:
	go run ./cmd/migration/main.go down

makemigrations:
	goose -s create $(MSG) sql -dir ./migrations