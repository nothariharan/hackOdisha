package services

import (
"ecotracker-backend/database"
"ecotracker-backend/models"
"errors"
"strconv"
"time"
)

type ShopService struct {
db *database.Database
}

func NewShopService(db *database.Database) *ShopService {
return &ShopService{db: db}
}

func (s *ShopService) Register(req models.ShopRegistration) (*models.Shop, error) {
// Check if shop already exists
var count int
err := s.db.DB.QueryRow("SELECT COUNT(*) FROM shops WHERE email = ?", req.Email).Scan(&count)
if err != nil {
return nil, err
}
if count > 0 {
return nil, errors.New("shop already exists")
}

// Insert new shop
result, err := s.db.DB.Exec(`
INSERT INTO shops (email, password, name, address, phone, description, created_at, updated_at) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
req.Email, req.Password, req.Name, req.Address, req.Phone, req.Description, time.Now(), time.Now())
if err != nil {
return nil, err
}

id, err := result.LastInsertId()
if err != nil {
return nil, err
}

shop := &models.Shop{
ID:          int(id),
Email:       req.Email,
Name:        req.Name,
Address:     req.Address,
Phone:       req.Phone,
Description: req.Description,
CreatedAt:   time.Now(),
UpdatedAt:   time.Now(),
}

return shop, nil
}

func (s *ShopService) RegisterWithItems(req models.ShopRegistration, items []models.ShopItem) (*models.Shop, error) {
// First register the shop
shop, err := s.Register(req)
if err != nil {
return nil, err
}

// Then add items
for _, item := range items {
_, err := s.AddItem(shop.ID, item)
if err != nil {
return nil, err
}
}

return shop, nil
}

func (s *ShopService) Login(req models.ShopLogin) (*models.Shop, error) {
shop := &models.Shop{}
err := s.db.DB.QueryRow(`
SELECT id, email, password, name, address, phone, description, created_at, updated_at 
FROM shops WHERE email = ? AND password = ?`,
req.Email, req.Password).Scan(
&shop.ID, &shop.Email, &shop.Password, &shop.Name, &shop.Address, 
&shop.Phone, &shop.Description, &shop.CreatedAt, &shop.UpdatedAt)

if err != nil {
return nil, errors.New("invalid credentials")
}

return shop, nil
}

func (s *ShopService) GetShop(id string) (*models.Shop, error) {
shopID, err := strconv.Atoi(id)
if err != nil {
return nil, errors.New("invalid shop ID")
}

shop := &models.Shop{}
err = s.db.DB.QueryRow(`
SELECT id, email, password, name, address, phone, description, created_at, updated_at 
FROM shops WHERE id = ?`,
shopID).Scan(
&shop.ID, &shop.Email, &shop.Password, &shop.Name, &shop.Address, 
&shop.Phone, &shop.Description, &shop.CreatedAt, &shop.UpdatedAt)

if err != nil {
return nil, errors.New("shop not found")
}

return shop, nil
}

func (s *ShopService) AddItem(shopID int, item models.ShopItem) (*models.ShopItem, error) {
// Set defaults for missing fields
if item.Description == "" {
item.Description = item.Category + " product"
}

// Determine eco-friendly status based on category if not set
if !item.IsEcoFriendly {
item.IsEcoFriendly = item.Category == "Organic" || item.Category == "Eco-Friendly" || 
item.Category == "Fruits" || item.Category == "Vegetables"
}

// Insert new item
result, err := s.db.DB.Exec(`
INSERT INTO shop_items (shop_id, name, price, category, description, is_eco_friendly) 
VALUES (?, ?, ?, ?, ?, ?)`,
shopID, item.Name, item.Price, item.Category, item.Description, item.IsEcoFriendly)
if err != nil {
return nil, err
}

id, err := result.LastInsertId()
if err != nil {
return nil, err
}

item.ID = int(id)
item.ShopID = shopID
return &item, nil
}

func (s *ShopService) GetItems(shopID int) ([]models.ShopItem, error) {
rows, err := s.db.DB.Query(`
SELECT id, shop_id, name, price, category, description, is_eco_friendly 
FROM shop_items WHERE shop_id = ?`,
shopID)
if err != nil {
return nil, err
}
defer rows.Close()

var items []models.ShopItem
for rows.Next() {
var item models.ShopItem
err := rows.Scan(&item.ID, &item.ShopID, &item.Name, &item.Price, 
&item.Category, &item.Description, &item.IsEcoFriendly)
if err != nil {
return nil, err
}
items = append(items, item)
}

return items, nil
}
