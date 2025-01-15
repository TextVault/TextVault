FROM golang:1.23
WORKDIR /src
COPY . .
RUN go build -o /cmd/server/main.go

FROM scratch
COPY --from=0 /bin/hello /bin/hello
CMD ["/bin/hello"]