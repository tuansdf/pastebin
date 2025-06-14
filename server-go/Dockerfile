FROM golang:1.24-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN GOOS=linux go build -o app-bin .

FROM alpine:3
WORKDIR /root/
COPY --from=builder /app/app-bin .

EXPOSE 5000
CMD ["./app-bin"]
