package handlers

import (
"ecotracker-backend/models"
"ecotracker-backend/services"
"encoding/json"
"net/http"
"strconv"
"strings"
)

type ReceiptHandler struct {
receiptService *services.ReceiptService
}

func NewReceiptHandler(receiptService *services.ReceiptService) *ReceiptHandler {
return &ReceiptHandler{receiptService: receiptService}
}

func (h *ReceiptHandler) CreateReceipt(w http.ResponseWriter, r *http.Request) {
if r.Method != "POST" {
http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
return
}

var req models.ReceiptCreate
if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
http.Error(w, "Invalid JSON", http.StatusBadRequest)
return
}

receipt, err := h.receiptService.CreateReceipt(req)
if err != nil {
http.Error(w, err.Error(), http.StatusBadRequest)
return
}

w.Header().Set("Content-Type", "application/json")
json.NewEncoder(w).Encode(receipt)
}

func (h *ReceiptHandler) GetUserReceipts(w http.ResponseWriter, r *http.Request) {
if r.Method != "GET" {
http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
return
}

// Extract ID from URL path
path := strings.TrimPrefix(r.URL.Path, "/api/users/")
if path == "" {
http.Error(w, "User ID required", http.StatusBadRequest)
return
}

// Remove "/receipts" suffix to get just the user ID
userIDStr := strings.TrimSuffix(path, "/receipts")
userID, err := strconv.Atoi(userIDStr)
if err != nil {
http.Error(w, "Invalid user ID", http.StatusBadRequest)
return
}

receipts, err := h.receiptService.GetUserReceipts(userID)
if err != nil {
http.Error(w, err.Error(), http.StatusInternalServerError)
return
}

w.Header().Set("Content-Type", "application/json")
json.NewEncoder(w).Encode(receipts)
}

func (h *ReceiptHandler) DeleteReceipt(w http.ResponseWriter, r *http.Request) {
	if r.Method != "DELETE" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Extract receipt ID from URL path
	path := strings.TrimPrefix(r.URL.Path, "/api/receipts/")
	if path == "" {
		http.Error(w, "Receipt ID required", http.StatusBadRequest)
		return
	}

	receiptID, err := strconv.Atoi(path)
	if err != nil {
		http.Error(w, "Invalid receipt ID", http.StatusBadRequest)
		return
	}

	err = h.receiptService.DeleteReceipt(receiptID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Receipt deleted successfully"})
}

func (h *ReceiptHandler) GetUserChallenges(w http.ResponseWriter, r *http.Request) {
if r.Method != "GET" {
http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
return
}

// Extract ID from URL path
path := strings.TrimPrefix(r.URL.Path, "/api/users/")
if path == "" {
http.Error(w, "User ID required", http.StatusBadRequest)
return
}

// Remove "/challenges" suffix to get just the user ID
userIDStr := strings.TrimSuffix(path, "/challenges")
userID, err := strconv.Atoi(userIDStr)
if err != nil {
http.Error(w, "Invalid user ID", http.StatusBadRequest)
return
}

challenges, err := h.receiptService.GetUserChallenges(userID)
if err != nil {
http.Error(w, err.Error(), http.StatusInternalServerError)
return
}

w.Header().Set("Content-Type", "application/json")
json.NewEncoder(w).Encode(challenges)
}

func (h *ReceiptHandler) GetShopReceipts(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Extract shop ID from URL path
	path := strings.TrimPrefix(r.URL.Path, "/api/shops/")
	path = strings.TrimSuffix(path, "/receipts")
	if path == "" {
		http.Error(w, "Shop ID required", http.StatusBadRequest)
		return
	}

	shopID, err := strconv.Atoi(path)
	if err != nil {
		http.Error(w, "Invalid shop ID", http.StatusBadRequest)
		return
	}

	receipts, err := h.receiptService.GetShopReceipts(shopID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(receipts)
}
