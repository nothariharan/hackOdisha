package models

import "time"

type Shop struct {
ID          int       `json:"id"`
Email       string    `json:"email"`
Password    string    `json:"-"`
Name        string    `json:"name"`
Address     string    `json:"address"`
Phone       string    `json:"phone"`
Description string    `json:"description"`
CreatedAt   time.Time `json:"created_at"`
UpdatedAt   time.Time `json:"updated_at"`
}

type ShopItem struct {
ID            int     `json:"id"`
ShopID        int     `json:"shop_id"`
Name          string  `json:"name"`
Price         float64 `json:"price"`
Category      string  `json:"category"`
Description   string  `json:"description"`
IsEcoFriendly bool    `json:"is_eco_friendly"`
}

type ShopRegistration struct {
Email       string `json:"email" validate:"required,email"`
Password    string `json:"password" validate:"required,min=6"`
Name        string `json:"name" validate:"required"`
Address     string `json:"address" validate:"required"`
Phone       string `json:"phone" validate:"required"`
Description string `json:"description"`
}

type ShopLogin struct {
Email    string `json:"email" validate:"required,email"`
Password string `json:"password" validate:"required"`
}
