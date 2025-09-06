FROM golang:1.23-alpine

# Install dependencies
RUN apk --no-cache add ca-certificates sqlite gcc musl-dev

WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=1 GOOS=linux go build -a -installsuffix cgo -o main .

# Expose port
EXPOSE 8000

# Run the application
CMD ["./main"]
