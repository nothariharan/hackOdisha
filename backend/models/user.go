package models

import "time"

type User struct {
ID        int       `json:"id"`
Email     string    `json:"email"`
Password  string    `json:"-"`
Name      string    `json:"name"`
Phone     string    `json:"phone"`
Points    int       `json:"points"`
CreatedAt time.Time `json:"created_at"`
UpdatedAt time.Time `json:"updated_at"`
}

type UserRegistration struct {
Email    string `json:"email" validate:"required,email"`
Password string `json:"password" validate:"required,min=6"`
Name     string `json:"name" validate:"required"`
Phone    string `json:"phone" validate:"required"`
}

type UserLogin struct {
Email    string `json:"email" validate:"required,email"`
Password string `json:"password" validate:"required"`
}
