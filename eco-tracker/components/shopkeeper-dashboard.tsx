"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import Image from "next/image"
import { type User, type ShopItem, ApiService } from "@/lib/api"

interface ShopkeeperDashboardProps {
  onLogout: () => void
  shopItems?: ShopItem[]
  user: User | null
}

export function ShopkeeperDashboard({ onLogout, shopItems = [], user }: ShopkeeperDashboardProps) {
  const [customerIdentifier, setCustomerIdentifier] = useState("")
  const [selectedItems, setSelectedItems] = useState<{ [key: number]: number }>({})
  const [showReceipt, setShowReceipt] = useState(false)
  const [receiptData, setReceiptData] = useState<any>(null)
  const [currentShopItems, setCurrentShopItems] = useState<ShopItem[]>(shopItems || [])
  const [showAddItemForm, setShowAddItemForm] = useState(false)
  const [newItem, setNewItem] = useState({ name: "", price: "", category: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const shopName = user?.name || "Your Shop"

  useEffect(() => {
    if (user?.id) {
      fetchShopItems()
    }
  }, [user?.id])

  const fetchShopItems = async () => {
    if (!user?.id) return
    
    try {
      const items = await ApiService.getShopItems(user.id)
      setCurrentShopItems(items || [])
    } catch (error) {
      console.error('Error fetching shop items:', error)
      setCurrentShopItems([])
    }
  }

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id || !newItem.name || !newItem.price || !newItem.category) return

    try {
      setIsLoading(true)
      setError("")
      const item: ShopItem = {
        id: 0, // Will be set by backend
        name: newItem.name,
        price: parseFloat(newItem.price),
        category: newItem.category
      }

      await ApiService.addShopItem(user.id, item)
      
      // Reset form
      setNewItem({ name: "", price: "", category: "" })
      setShowAddItemForm(false)
      
      // Refresh items list
      await fetchShopItems()
    } catch (error) {
      console.error('Error adding item:', error)
      setError("Failed to add item. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleItemQuantityChange = (itemId: number, quantity: number) => {
    if (quantity < 0) return
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: quantity
    }))
  }

  const calculateTotal = () => {
    return Object.entries(selectedItems).reduce((total, [itemId, quantity]) => {
      const item = currentShopItems.find(i => i.id === parseInt(itemId))
      return total + (item ? item.price * quantity : 0)
    }, 0)
  }

  const handleIssueReceipt = async () => {
    setError("")
    
    // Validation checks
    if (!customerIdentifier.trim()) {
      setError("Please enter a customer identifier")
      return
    }
    
    if (!currentShopItems || currentShopItems.length === 0) {
      setError("No items available in your shop. Please add items first.")
      return
    }

    const purchasedItems = Object.entries(selectedItems)
      .filter(([_, quantity]) => quantity > 0)
      .map(([itemId, quantity]) => {
        const item = currentShopItems.find(i => i.id === parseInt(itemId))
        return item ? { ...item, quantity } : null
      })
      .filter(Boolean)

    if (purchasedItems.length === 0) {
      setError("Please select at least one item to issue a receipt")
      return
    }

    const total = calculateTotal()
    const pointsEarned = Math.floor(total * 2) // 2 points per dollar

    try {
      // Create receipt in database
      const receiptData = {
        customer_identifier: customerIdentifier,
        shop_id: user?.id,
        items: purchasedItems,
        total_amount: total,
        points_earned: pointsEarned
      }

      // For now, we'll show the receipt popup
      // In a real app, you'd save this to the database
      setReceiptData({
        customerIdentifier,
        items: purchasedItems,
        total,
        pointsEarned,
        timestamp: new Date().toLocaleString()
      })

      setShowReceipt(true)
      setSelectedItems({})
      setCustomerIdentifier("")
      
      // Show success message
      setError("")
      
    } catch (error) {
      console.error('Error creating receipt:', error)
      setError("Failed to create receipt. Please try again.")
    }
  }

  const closeReceipt = () => {
    setShowReceipt(false)
    setReceiptData(null)
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Image
            src="/logo.png"
            alt="EcoTrack Logo"
            width={32}
            height={32}
            style={{ borderRadius: '50%' }}
          />
          <span style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937' }}>EcoTrack</span>
        </div>
        <button onClick={onLogout} className="btn-outline">
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Welcome Section */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="dashboard-title" style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '16px'
          }}>
            {shopName} Dashboard
          </h1>
          <p className="dashboard-subtitle">Manage your shop and issue eco-friendly receipts</p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{ 
            backgroundColor: '#fef2f2', 
            border: '1px solid #fecaca', 
            color: '#dc2626',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-title">Total Items</div>
            <div className="stat-value">{currentShopItems?.length || 0}</div>
            <div className="stat-description">Products in your inventory</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Receipts Issued</div>
            <div className="stat-value">0</div>
            <div className="stat-description">Eco-friendly receipts sent</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Points Awarded</div>
            <div className="stat-value">0</div>
            <div className="stat-description">Total points given to customers</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="cards-grid">
          {/* Shop Items */}
          <Card className="card">
            <CardHeader className="card-header">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <CardTitle className="card-title"> Shop Items</CardTitle>
                  <CardDescription className="card-description">
                    Your available products for customers
                  </CardDescription>
                </div>
                <button 
                  onClick={() => setShowAddItemForm(!showAddItemForm)}
                  className="btn-outline"
                  style={{ padding: '8px 16px', fontSize: '14px' }}
                >
                  {showAddItemForm ? 'Cancel' : '+ Add Item'}
                </button>
              </div>
            </CardHeader>
            <CardContent className="card-content">
              {/* Add Item Form */}
              {showAddItemForm && (
                <form onSubmit={handleAddItem} style={{ 
                  marginBottom: '16px', 
                  padding: '16px', 
                  backgroundColor: '#f9fafb', 
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label className="label" htmlFor="item-name">Item Name</label>
                      <input
                        id="item-name"
                        type="text"
                        placeholder="Enter item name"
                        className="input"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        required
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <label className="label" htmlFor="item-price">Price ($)</label>
                        <input
                          id="item-price"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="input"
                          value={newItem.price}
                          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                          required
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label className="label" htmlFor="item-category">Category</label>
                        <select
                          id="item-category"
                          className="input"
                          value={newItem.category}
                          onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                          required
                        >
                          <option value="">Select Category</option>
                          <option value="Food">Food</option>
                          <option value="Organic">Organic</option>
                          <option value="Eco-Friendly">Eco-Friendly</option>
                          <option value="Fruits">Fruits</option>
                          <option value="Vegetables">Vegetables</option>
                          <option value="General">General</option>
                        </select>
                      </div>
                    </div>
                    <button 
                      type="submit" 
                      className="btn-primary" 
                      disabled={isLoading}
                      style={{ width: '100%' }}
                    >
                      {isLoading ? 'Adding...' : 'Add Item'}
                    </button>
                  </div>
                </form>
              )}

              {/* Items List */}
              {!currentShopItems || currentShopItems.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon"></div>
                  <div className="empty-title">Shop is empty</div>
                  <div className="empty-description">
                    Add products to your inventory to start serving customers
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {currentShopItems.map((item) => (
                    <div key={item.id} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '12px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div>
                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>{item.name}</div>
                        <div style={{ fontSize: '14px', color: '#6b7280' }}>
                          ${item.price.toFixed(2)}  {item.category}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => handleItemQuantityChange(item.id, (selectedItems[item.id] || 0) - 1)}
                          className="btn-outline"
                          style={{ width: '32px', height: '32px', padding: '0' }}
                        >
                          -
                        </button>
                        <span style={{ minWidth: '20px', textAlign: 'center' }}>
                          {selectedItems[item.id] || 0}
                        </span>
                        <button
                          onClick={() => handleItemQuantityChange(item.id, (selectedItems[item.id] || 0) + 1)}
                          className="btn-outline"
                          style={{ width: '32px', height: '32px', padding: '0' }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Issue Receipt */}
          <Card className="card">
            <CardHeader className="card-header">
              <CardTitle className="card-title"> Issue Receipt</CardTitle>
              <CardDescription className="card-description">
                Create eco-friendly receipts for customers
              </CardDescription>
            </CardHeader>
            <CardContent className="card-content">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="label" htmlFor="customer-id">Customer Identifier</label>
                  <input
                    id="customer-id"
                    type="text"
                    placeholder="Enter customer email or phone"
                    className="input"
                    value={customerIdentifier}
                    onChange={(e) => setCustomerIdentifier(e.target.value)}
                  />
                </div>

                {Object.keys(selectedItems).length > 0 && (
                  <div style={{ 
                    backgroundColor: '#f0f9ff', 
                    padding: '16px', 
                    borderRadius: '8px',
                    border: '1px solid #0ea5e9'
                  }}>
                    <h4 style={{ marginBottom: '12px', color: '#0c4a6e' }}>Selected Items:</h4>
                    {Object.entries(selectedItems)
                      .filter(([_, quantity]) => quantity > 0)
                      .map(([itemId, quantity]) => {
                        const item = currentShopItems.find(i => i.id === parseInt(itemId))
                        return item ? (
                          <div key={itemId} style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            marginBottom: '8px'
                          }}>
                            <span>{item.name} x{quantity}</span>
                            <span>${(item.price * quantity).toFixed(2)}</span>
                          </div>
                        ) : null
                      })}
                    <div style={{ 
                      borderTop: '1px solid #0ea5e9', 
                      paddingTop: '8px', 
                      marginTop: '8px',
                      display: 'flex', 
                      justifyContent: 'space-between',
                      fontWeight: '600'
                    }}>
                      <span>Total:</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleIssueReceipt}
                  className="btn-primary"
                  style={{ width: '100%' }}
                >
                  Issue Receipt
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && receiptData && (
        <div className="modal">
          <div className="modal-backdrop" onClick={closeReceipt} />
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="header">
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
                 Eco-Friendly Receipt
              </h2>
            </div>
            <div className="content">
              <div style={{ marginBottom: '16px' }}>
                <strong>Customer:</strong> {receiptData.customerIdentifier}
              </div>
              <div style={{ marginBottom: '16px' }}>
                <strong>Date:</strong> {receiptData.timestamp}
              </div>
              <div style={{ marginBottom: '16px' }}>
                <strong>Items:</strong>
                {receiptData.items.map((item: any, index: number) => (
                  <div key={index} style={{ marginLeft: '16px', marginTop: '4px' }}>
                    {item.name} x{item.quantity} - ${(item.price * item.quantity).toFixed(2)}
                  </div>
                ))}
              </div>
              <div style={{ 
                borderTop: '2px solid #e5e7eb', 
                paddingTop: '12px',
                display: 'flex', 
                justifyContent: 'space-between',
                fontWeight: '600',
                fontSize: '18px'
              }}>
                <span>Total:</span>
                <span>${receiptData.total.toFixed(2)}</span>
              </div>
              <div style={{ 
                backgroundColor: '#f0fdf4',
                padding: '12px',
                borderRadius: '8px',
                marginTop: '16px',
                textAlign: 'center'
              }}>
                <div style={{ color: '#16a34a', fontWeight: '600' }}>
                   Eco Points Earned: {receiptData.pointsEarned}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                  Thank you for choosing eco-friendly products!
                </div>
              </div>
              <button onClick={closeReceipt} className="btn-primary" style={{ width: '100%', marginTop: '16px' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
