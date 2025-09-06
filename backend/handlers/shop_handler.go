package handlers

import (
"ecotracker-backend/models"
"ecotracker-backend/services"
"encoding/json"
"net/http"
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

var req models.ShopRegistration
if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
http.Error(w, "Invalid JSON", http.StatusBadRequest)
return
}

shop, err := h.shopService.Register(req)
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
