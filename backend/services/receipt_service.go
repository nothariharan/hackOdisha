package services

import (
"ecotracker-backend/database"
"ecotracker-backend/models"
"errors"
)

type ReceiptService struct {
db *database.Database
}

func NewReceiptService(db *database.Database) *ReceiptService {
return &ReceiptService{db: db}
}

func (s *ReceiptService) CreateReceipt(receiptCreate models.ReceiptCreate) (*models.Receipt, error) {
// Calculate total amount and points
totalAmount := 0.0
pointsEarned := 0

for _, item := range receiptCreate.Items {
totalAmount += item.Price * float64(item.Quantity)
// Award points based on eco-friendly categories
if item.Category == "Organic" || item.Category == "Eco-Friendly" {
pointsEarned += int(item.Price) * item.Quantity * 2
} else {
pointsEarned += int(item.Price) * item.Quantity
}
}

// Insert receipt
result, err := s.db.DB.Exec(`
INSERT INTO receipts (user_id, shop_id, total_amount, points_earned, created_at) 
VALUES (?, ?, ?, ?, datetime('now'))`,
receiptCreate.UserID, receiptCreate.ShopID, totalAmount, pointsEarned)
if err != nil {
return nil, err
}

receiptID, err := result.LastInsertId()
if err != nil {
return nil, err
}

// Insert receipt items
for _, item := range receiptCreate.Items {
_, err := s.db.DB.Exec(`
INSERT INTO receipt_items (receipt_id, name, price, quantity, category, is_eco_friendly) 
VALUES (?, ?, ?, ?, ?, ?)`,
receiptID, item.Name, item.Price, item.Quantity, item.Category, item.IsEcoFriendly)
if err != nil {
return nil, err
}
}

// Update customer's points
_, err = s.db.DB.Exec(`
UPDATE users SET points = points + ?, updated_at = datetime('now') 
WHERE id = ?`,
pointsEarned, receiptCreate.UserID)
if err != nil {
return nil, err
}

receipt := &models.Receipt{
ID:           int(receiptID),
ShopID:       receiptCreate.ShopID,
UserID:       receiptCreate.UserID,
Items:        receiptCreate.Items,
TotalAmount:  totalAmount,
PointsEarned: pointsEarned,
}

return receipt, nil
}

func (s *ReceiptService) GetUserReceipts(userID int) ([]models.Receipt, error) {
rows, err := s.db.DB.Query(`
SELECT r.id, r.user_id, r.shop_id, r.total_amount, r.points_earned, r.created_at
FROM receipts r WHERE r.user_id = ? ORDER BY r.created_at DESC`,
userID)
if err != nil {
return nil, err
}
defer rows.Close()

var receipts []models.Receipt
for rows.Next() {
var receipt models.Receipt
err := rows.Scan(&receipt.ID, &receipt.UserID, &receipt.ShopID, 
&receipt.TotalAmount, &receipt.PointsEarned, &receipt.CreatedAt)
if err != nil {
return nil, err
}
receipts = append(receipts, receipt)
}

return receipts, nil
}

func (s *ReceiptService) GetShopReceipts(shopID int) ([]models.Receipt, error) {
rows, err := s.db.DB.Query(`
SELECT r.id, r.user_id, r.shop_id, r.total_amount, r.points_earned, r.created_at
FROM receipts r WHERE r.shop_id = ? ORDER BY r.created_at DESC`,
shopID)
if err != nil {
return nil, err
}
defer rows.Close()

var receipts []models.Receipt
for rows.Next() {
var receipt models.Receipt
err := rows.Scan(&receipt.ID, &receipt.UserID, &receipt.ShopID, 
&receipt.TotalAmount, &receipt.PointsEarned, &receipt.CreatedAt)
if err != nil {
return nil, err
}
receipts = append(receipts, receipt)
}

return receipts, nil
}

func (s *ReceiptService) GetReceipt(id int) (*models.Receipt, error) {
receipt := &models.Receipt{}
err := s.db.DB.QueryRow(`
SELECT id, user_id, shop_id, total_amount, points_earned, created_at
FROM receipts WHERE id = ?`,
id).Scan(&receipt.ID, &receipt.UserID, &receipt.ShopID, 
&receipt.TotalAmount, &receipt.PointsEarned, &receipt.CreatedAt)

if err != nil {
return nil, errors.New("receipt not found")
}

return receipt, nil
}

func (s *ReceiptService) GetUserChallenges(userID int) ([]models.Challenge, error) {
// Get user's receipts to calculate progress
receipts, _ := s.GetUserReceipts(userID)

challenges := []models.Challenge{
{
ID:          1,
Name:        "Eco-Friendly Shopping",
Description: "Buy 5 organic products",
Icon:        "",
Target:      5,
Progress:    0,
Earned:      false,
},
{
ID:          2,
Name:        "Fruit & Veggie Lover",
Description: "Purchase 10 fruits/vegetables",
Icon:        "",
Target:      10,
Progress:    0,
Earned:      false,
},
{
ID:          3,
Name:        "Sustainable Living",
Description: "Buy 3 eco-friendly items",
Icon:        "",
Target:      3,
Progress:    0,
Earned:      false,
},
{
ID:          4,
Name:        "Local Business Support",
Description: "Shop at 2 local stores",
Icon:        "",
Target:      2,
Progress:    0,
Earned:      false,
},
}

// Calculate progress based on receipts
organicCount := 0
produceCount := 0
ecoFriendlyCount := 0
uniqueShops := make(map[int]bool)

for _, receipt := range receipts {
uniqueShops[receipt.ShopID] = true
// Note: We would need to fetch receipt items to calculate category-based progress
// For now, we'll use a simplified calculation
}

// Update challenge progress
challenges[0].Progress = organicCount
challenges[0].Earned = organicCount >= challenges[0].Target

challenges[1].Progress = produceCount
challenges[1].Earned = produceCount >= challenges[1].Target

challenges[2].Progress = ecoFriendlyCount
challenges[2].Earned = ecoFriendlyCount >= challenges[2].Target

challenges[3].Progress = len(uniqueShops)
challenges[3].Earned = len(uniqueShops) >= challenges[3].Target

return challenges, nil
}

func (s *ReceiptService) DeleteReceipt(receiptID int) error {
	// First, get the receipt to know how many points to subtract
	var userID int
	var pointsEarned int
	err := s.db.DB.QueryRow(`
		SELECT user_id, points_earned FROM receipts WHERE id = ?`,
		receiptID).Scan(&userID, &pointsEarned)
	if err != nil {
		return errors.New("receipt not found")
	}

	// Delete receipt items first (foreign key constraint)
	_, err = s.db.DB.Exec(`DELETE FROM receipt_items WHERE receipt_id = ?`, receiptID)
	if err != nil {
		return err
	}

	// Delete the receipt
	_, err = s.db.DB.Exec(`DELETE FROM receipts WHERE id = ?`, receiptID)
	if err != nil {
		return err
	}

	// Note: We don't subtract points when deleting receipts to prevent negative points
	// Points remain with the customer as a reward for their past eco-friendly purchases

	return nil
}
