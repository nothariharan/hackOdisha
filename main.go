package main

import (
"ecotracker-backend/database"
"ecotracker-backend/handlers"
"ecotracker-backend/services"
"gofr.dev/pkg/gofr"
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

app := gofr.New()

// Health check
app.GET("/health", func(c *gofr.Context) (interface{}, error) {
return map[string]string{"status": "healthy", "database": "connected"}, nil
})

// User routes
app.POST("/api/users/register", userHandler.Register)
app.POST("/api/users/login", userHandler.Login)
app.GET("/api/users/{id}", userHandler.GetUser)

// Shop routes
app.POST("/api/shops/register", shopHandler.Register)
app.POST("/api/shops/login", shopHandler.Login)
app.GET("/api/shops/{id}", shopHandler.GetShop)

// Receipt routes
app.POST("/api/receipts", receiptHandler.CreateReceipt)
app.GET("/api/users/{id}/receipts", receiptHandler.GetUserReceipts)
app.GET("/api/users/{id}/challenges", receiptHandler.GetUserChallenges)

// Start the server
app.Run()
}
