FROM golang:1.23 AS builder
WORKDIR /src
COPY . .
RUN go build -o /bin/server ./cmd/server/main.go
RUN go build -o /bin/migrations ./cmd/migration/main.go

FROM alpine:latest AS production-image
COPY --from=builder /bin/server /bin/server
CMD ["/bin/server"]

FROM alpine:latest AS migrations-image
COPY --from=builder /bin/migrations /bin/migrations
CMD ["/bin/migrations"]