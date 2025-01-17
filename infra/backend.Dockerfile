FROM golang:1.23-alpine AS builder
WORKDIR /src
COPY . .
RUN go build -o /bin/textvault ./cmd/server/main.go
RUN go build -o /bin/migrations ./cmd/migration/main.go

FROM alpine:latest AS production-image
COPY --from=builder /bin/textvault /bin/textvault
CMD ["/bin/textvault"]

FROM alpine:latest AS migrations-image
COPY --from=builder /bin/migrations /bin/migrations
COPY --from=builder /src/migrations /migrations
CMD ["/bin/migrations", "-up"]