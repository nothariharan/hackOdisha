package models

import "time"

type Challenge struct {
ID          int       `json:"id"`
UserID      int       `json:"user_id"`
Name        string    `json:"name"`
Description string    `json:"description"`
Icon        string    `json:"icon"`
Target      int       `json:"target"`
Progress    int       `json:"progress"`
Earned      bool      `json:"earned"`
IsCompleted bool      `json:"is_completed"`
Points      int       `json:"points"`
CreatedAt   time.Time `json:"created_at"`
UpdatedAt   time.Time `json:"updated_at"`
}

type ChallengeUpdate struct {
UserID   int `json:"user_id" validate:"required"`
Progress int `json:"progress" validate:"required"`
}
