"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import Image from "next/image"
import { type User } from "@/lib/api"

interface ShopItem {
  id: number
  name: string
  price: number
  category: string
}

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

  const shopName = user?.name || "Your Shop"

  const handleItemQuantityChange = (itemId: number, quantity: number) => {
    if (quantity < 0) return
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: quantity
    }))
  }

  const calculateTotal = () => {
    return Object.entries(selectedItems).reduce((total, [itemId, quantity]) => {
      const item = shopItems.find(i => i.id === parseInt(itemId))
      return total + (item ? item.price * quantity : 0)
    }, 0)
  }

  const handleIssueReceipt = () => {
    if (!customerIdentifier.trim() || shopItems.length === 0) return

    const purchasedItems = Object.entries(selectedItems)
      .filter(([_, quantity]) => quantity > 0)
      .map(([itemId, quantity]) => {
        const item = shopItems.find(i => i.id === parseInt(itemId))
        return item ? { ...item, quantity } : null
      })
      .filter(Boolean)

    if (purchasedItems.length === 0) return

    const total = calculateTotal()
    const pointsEarned = Math.floor(total * 2) // 2 points per dollar

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

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-title">Total Items</div>
            <div className="stat-value">{shopItems.length}</div>
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
              <CardTitle className="card-title"> Shop Items</CardTitle>
              <CardDescription className="card-description">
                Your available products for customers
              </CardDescription>
            </CardHeader>
            <CardContent className="card-content">
              {shopItems.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon"></div>
                  <div className="empty-title">Shop is empty</div>
                  <div className="empty-description">
                    Add products to your inventory to start serving customers
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {shopItems.map((item) => (
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
                        const item = shopItems.find(i => i.id === parseInt(itemId))
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
                  disabled={!customerIdentifier.trim() || shopItems.length === 0}
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
