package services

import (
"ecotracker-backend/database"
"ecotracker-backend/models"
"errors"
"strconv"
"strings"
"time"
)

type UserService struct {
db *database.Database
}

func NewUserService(db *database.Database) *UserService {
return &UserService{db: db}
}

func (s *UserService) Register(req models.UserRegistration) (*models.User, error) {
// Check if user already exists
var count int
err := s.db.DB.QueryRow("SELECT COUNT(*) FROM users WHERE email = ?", req.Email).Scan(&count)
if err != nil {
return nil, err
}
if count > 0 {
return nil, errors.New("user already exists")
}

// Insert new user
result, err := s.db.DB.Exec(`
INSERT INTO users (email, password, name, phone, points, created_at, updated_at) 
VALUES (?, ?, ?, ?, 0, ?, ?)`,
req.Email, req.Password, req.Name, req.Phone, time.Now(), time.Now())
if err != nil {
return nil, err
}

id, err := result.LastInsertId()
if err != nil {
return nil, err
}

// Return the created user
user := &models.User{
ID:        int(id),
Email:     req.Email,
Password:  req.Password,
Name:      req.Name,
Phone:     req.Phone,
Points:    0,
CreatedAt: time.Now(),
UpdatedAt: time.Now(),
}

return user, nil
}

func (s *UserService) Login(req models.UserLogin) (*models.User, error) {
user := &models.User{}
err := s.db.DB.QueryRow(`
SELECT id, email, password, name, phone, points, created_at, updated_at 
FROM users WHERE email = ? AND password = ?`,
req.Email, req.Password).Scan(
&user.ID, &user.Email, &user.Password, &user.Name, &user.Phone, 
&user.Points, &user.CreatedAt, &user.UpdatedAt)

if err != nil {
return nil, errors.New("invalid credentials")
}

return user, nil
}

func (s *UserService) GetUser(id string) (*models.User, error) {
userID, err := strconv.Atoi(id)
if err != nil {
return nil, errors.New("invalid user ID")
}

user := &models.User{}
err = s.db.DB.QueryRow(`
SELECT id, email, password, name, phone, points, created_at, updated_at 
FROM users WHERE id = ?`,
userID).Scan(
&user.ID, &user.Email, &user.Password, &user.Name, &user.Phone, 
&user.Points, &user.CreatedAt, &user.UpdatedAt)

if err != nil {
return nil, errors.New("user not found")
}

return user, nil
}

func (s *UserService) UpdateUser(id string, updates map[string]interface{}) (*models.User, error) {
userID, err := strconv.Atoi(id)
if err != nil {
return nil, errors.New("invalid user ID")
}

// Build update query dynamically
setParts := []string{}
args := []interface{}{}

if name, ok := updates["name"].(string); ok {
setParts = append(setParts, "name = ?")
args = append(args, name)
}
if phone, ok := updates["phone"].(string); ok {
setParts = append(setParts, "phone = ?")
args = append(args, phone)
}

if len(setParts) == 0 {
return nil, errors.New("no valid updates provided")
}

setParts = append(setParts, "updated_at = ?")
args = append(args, time.Now())
args = append(args, userID)

query := "UPDATE users SET " + strings.Join(setParts, ", ") + " WHERE id = ?"
_, err = s.db.DB.Exec(query, args...)
if err != nil {
return nil, err
}

// Return updated user
return s.GetUser(id)
}
