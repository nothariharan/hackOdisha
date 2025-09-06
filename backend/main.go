package main

import (
"ecotracker-backend/database"
"ecotracker-backend/handlers"
"ecotracker-backend/services"
"encoding/json"
"fmt"
"log"
"net/http"
"os"
"strings"
)

func main() {
// Initialize database
db, err := database.NewDatabase()
if err != nil {
panic(err)
}
defer db.Close()

// Initialize services
userService := services.NewUserService(db)
shopService := services.NewShopService(db)
receiptService := services.NewReceiptService(db)

// Initialize handlers
userHandler := handlers.NewUserHandler(userService)
shopHandler := handlers.NewShopHandler(shopService)
receiptHandler := handlers.NewReceiptHandler(receiptService)

// CORS middleware
corsHandler := func(h http.HandlerFunc) http.HandlerFunc {
return func(w http.ResponseWriter, r *http.Request) {
w.Header().Set("Access-Control-Allow-Origin", "*")
w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

if r.Method == "OPTIONS" {
w.WriteHeader(http.StatusOK)
return
}

h(w, r)
}
}

// Main router function
router := func(w http.ResponseWriter, r *http.Request) {
path := r.URL.Path
method := r.Method

switch {
case path == "/health":
w.Header().Set("Content-Type", "application/json")
json.NewEncoder(w).Encode(map[string]string{
"status":   "healthy",
"database": "connected",
})

case path == "/api/users/register" && method == "POST":
userHandler.Register(w, r)

case path == "/api/users/login" && method == "POST":
userHandler.Login(w, r)

case strings.HasPrefix(path, "/api/users/") && method == "GET":
// Check if it's receipts or challenges
if strings.Contains(path, "/receipts") {
receiptHandler.GetUserReceipts(w, r)
} else if strings.Contains(path, "/challenges") {
receiptHandler.GetUserChallenges(w, r)
} else {
userHandler.GetUser(w, r)
}

case path == "/api/shops/register" && method == "POST":
shopHandler.Register(w, r)

case path == "/api/shops/login" && method == "POST":
shopHandler.Login(w, r)

case strings.HasPrefix(path, "/api/shops/") && method == "GET":
shopHandler.GetShop(w, r)

case path == "/api/receipts" && method == "POST":
receiptHandler.CreateReceipt(w, r)

default:
http.Error(w, "Not Found", http.StatusNotFound)
}
}

// Apply CORS to the main router
http.HandleFunc("/", corsHandler(router))

port := "8000"
if envPort := os.Getenv("PORT"); envPort != "" {
port = envPort
}

fmt.Printf("Server starting on port %s\n", port)
log.Fatal(http.ListenAndServe(":"+port, nil))
}
