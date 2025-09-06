package handlers

import (
"ecotracker-backend/models"
"ecotracker-backend/services"
"encoding/json"
"net/http"
"strconv"
"strings"
)

type ShopHandler struct {
shopService *services.ShopService
}

func NewShopHandler(shopService *services.ShopService) *ShopHandler {
return &ShopHandler{shopService: shopService}
}

func (h *ShopHandler) Register(w http.ResponseWriter, r *http.Request) {
if r.Method != "POST" {
http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
return
}

var req struct {
models.ShopRegistration
Items []models.ShopItem `json:"items"`
}

if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
http.Error(w, "Invalid JSON", http.StatusBadRequest)
return
}

var shop *models.Shop
var err error

// If items are provided, register with items
if len(req.Items) > 0 {
shop, err = h.shopService.RegisterWithItems(req.ShopRegistration, req.Items)
} else {
shop, err = h.shopService.Register(req.ShopRegistration)
}

if err != nil {
http.Error(w, err.Error(), http.StatusBadRequest)
return
}

w.Header().Set("Content-Type", "application/json")
json.NewEncoder(w).Encode(shop)
}

func (h *ShopHandler) Login(w http.ResponseWriter, r *http.Request) {
if r.Method != "POST" {
http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
return
}

var req models.ShopLogin
if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
http.Error(w, "Invalid JSON", http.StatusBadRequest)
return
}

shop, err := h.shopService.Login(req)
if err != nil {
http.Error(w, err.Error(), http.StatusUnauthorized)
return
}

w.Header().Set("Content-Type", "application/json")
json.NewEncoder(w).Encode(shop)
}

func (h *ShopHandler) GetShop(w http.ResponseWriter, r *http.Request) {
if r.Method != "GET" {
http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
return
}

// Extract ID from URL path
path := strings.TrimPrefix(r.URL.Path, "/api/shops/")
if path == "" {
http.Error(w, "Shop ID required", http.StatusBadRequest)
return
}

shop, err := h.shopService.GetShop(path)
if err != nil {
http.Error(w, err.Error(), http.StatusNotFound)
return
}

w.Header().Set("Content-Type", "application/json")
json.NewEncoder(w).Encode(shop)
}

func (h *ShopHandler) AddItem(w http.ResponseWriter, r *http.Request) {
if r.Method != "POST" {
http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
return
}

// Extract shop ID from URL path
path := strings.TrimPrefix(r.URL.Path, "/api/shops/")
path = strings.TrimSuffix(path, "/items")

shopID, err := strconv.Atoi(path)
if err != nil {
http.Error(w, "Invalid shop ID", http.StatusBadRequest)
return
}

var item models.ShopItem
if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
http.Error(w, "Invalid JSON", http.StatusBadRequest)
return
}

addedItem, err := h.shopService.AddItem(shopID, item)
if err != nil {
http.Error(w, err.Error(), http.StatusBadRequest)
return
}

w.Header().Set("Content-Type", "application/json")
json.NewEncoder(w).Encode(addedItem)
}

func (h *ShopHandler) GetItems(w http.ResponseWriter, r *http.Request) {
if r.Method != "GET" {
http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
return
}

// Extract shop ID from URL path
path := strings.TrimPrefix(r.URL.Path, "/api/shops/")
path = strings.TrimSuffix(path, "/items")

shopID, err := strconv.Atoi(path)
if err != nil {
http.Error(w, "Invalid shop ID", http.StatusBadRequest)
return
}

items, err := h.shopService.GetItems(shopID)
if err != nil {
http.Error(w, err.Error(), http.StatusInternalServerError)
return
}

w.Header().Set("Content-Type", "application/json")
json.NewEncoder(w).Encode(items)
}
