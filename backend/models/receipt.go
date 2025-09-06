package models

import "time"

type Receipt struct {
ID           int           `json:"id"`
UserID       int           `json:"user_id"`
ShopID       int           `json:"shop_id"`
Items        []ReceiptItem `json:"items"`
TotalAmount  float64       `json:"total_amount"`
PointsEarned int           `json:"points_earned"`
CreatedAt    time.Time     `json:"created_at"`
}

type ReceiptItem struct {
ID            int     `json:"id"`
ReceiptID     int     `json:"receipt_id"`
Name          string  `json:"name"`
Price         float64 `json:"price"`
Quantity      int     `json:"quantity"`
Category      string  `json:"category"`
IsEcoFriendly bool    `json:"is_eco_friendly"`
}

type ReceiptCreate struct {
UserID int           `json:"user_id" validate:"required"`
ShopID int           `json:"shop_id" validate:"required"`
Items  []ReceiptItem `json:"items" validate:"required"`
}
