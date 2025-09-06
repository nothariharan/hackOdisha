"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import Image from "next/image"

interface ShopItem {
  id: number
  name: string
  price: number
  category: string
}

interface ShopkeeperDashboardProps {
  onLogout: () => void
  shopItems?: ShopItem[]
}

export function ShopkeeperDashboard({ onLogout, shopItems = [] }: ShopkeeperDashboardProps) {
  const [showIssueReceipt, setShowIssueReceipt] = useState(false)
  const [customerIdentifier, setCustomerIdentifier] = useState("")
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>({})

  const topSellingItems: any[] = []
  const previousReceipts: any[] = []

  const handleIssueReceipt = () => {
    if (customerIdentifier.trim()) {
      const selectedItemsList = Object.entries(selectedItems)
        .filter(([_, quantity]) => quantity > 0)
        .map(([itemId, quantity]) => {
          const item = shopItems.find((i) => i.id.toString() === itemId)
          return `${item?.name} x${quantity}`
        })

      if (selectedItemsList.length > 0) {
        alert(`Receipt issued for: ${customerIdentifier}\nItems: ${selectedItemsList.join(", ")}`)
      } else {
        alert(`Receipt issued for: ${customerIdentifier}\nNo items selected`)
      }

      setCustomerIdentifier("")
      setSelectedItems({})
      setShowIssueReceipt(false)
    }
  }

  const handleItemQuantityChange = (itemId: string, quantity: number) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: Math.max(0, quantity),
    }))
  }

  return (
    <div className="dashboard">
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Shop Management Dashboard</h1>
            <p className="dashboard-subtitle">Manage your shop items and issue receipts</p>
          </div>
          <div className="dashboard-nav">
            <div className="nav-item">
              <span style={{ fontSize: '18px' }}>🏪</span>
              <span>ShopKeeper Portal</span>
            </div>
            <button
              onClick={onLogout}
              className="btn-outline"
              style={{ padding: '8px 16px', fontSize: '14px' }}
            >
              Logout
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => setShowIssueReceipt(!showIssueReceipt)}
            className="btn-primary"
            style={{ padding: '16px 48px', fontSize: '20px', fontWeight: '600' }}
          >
            <span style={{ marginRight: '8px' }}>🧾</span>
            Issue Receipt
          </button>
        </div>

        {/* Issue Receipt Form */}
        {showIssueReceipt && (
          <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="card-header">
              <div className="card-title">
                <span>🧾</span>
                Issue New Receipt
              </div>
              <div className="card-description">Enter customer details and select items</div>
            </div>
            <div className="card-content">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="form-group">
                  <label className="label" htmlFor="customer">Customer Username or Phone Number</label>
                  <input
                    id="customer"
                    placeholder="Enter username or phone number"
                    value={customerIdentifier}
                    onChange={(e) => setCustomerIdentifier(e.target.value)}
                    className="input"
                  />
                </div>

                <div className="form-group">
                  <label className="label">Select Items</label>
                  {shopItems.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">🏪</div>
                      <div className="empty-title">Shop is empty</div>
                      <div className="empty-description">Add products to your shop to start issuing receipts</div>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px', marginTop: '8px' }}>
                      {shopItems.map((item) => (
                        <div key={item.id} style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between', 
                          padding: '12px', 
                          borderRadius: '8px', 
                          backgroundColor: 'rgba(249, 250, 251, 0.5)' 
                        }}>
                          <div>
                            <div style={{ fontWeight: '500', fontSize: '14px' }}>{item.name}</div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>${item.price}</div>
                            <span style={{
                              display: 'inline-block',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: '500',
                              backgroundColor: 'transparent',
                              color: '#6b7280',
                              border: '1px solid #d1d5db',
                              marginTop: '4px'
                            }}>
                              {item.category}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                              onClick={() =>
                                handleItemQuantityChange(item.id.toString(), (selectedItems[item.id.toString()] || 0) - 1)
                              }
                              disabled={(selectedItems[item.id.toString()] || 0) <= 0}
                              className="btn-outline"
                              style={{ 
                                padding: '4px 8px', 
                                fontSize: '12px',
                                opacity: (selectedItems[item.id.toString()] || 0) <= 0 ? 0.5 : 1
                              }}
                            >
                              -
                            </button>
                            <span style={{ width: '32px', textAlign: 'center', fontSize: '14px' }}>
                              {selectedItems[item.id.toString()] || 0}
                            </span>
                            <button
                              onClick={() =>
                                handleItemQuantityChange(item.id.toString(), (selectedItems[item.id.toString()] || 0) + 1)
                              }
                              className="btn-outline"
                              style={{ padding: '4px 8px', fontSize: '12px' }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={handleIssueReceipt} 
                    disabled={!customerIdentifier.trim() || shopItems.length === 0}
                    className="btn-primary"
                    style={{ 
                      opacity: (!customerIdentifier.trim() || shopItems.length === 0) ? 0.5 : 1,
                      cursor: (!customerIdentifier.trim() || shopItems.length === 0) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Issue Receipt
                  </button>
                  <button 
                    onClick={() => setShowIssueReceipt(false)}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="cards-grid">
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <span>📈</span>
                Top Selling Items
              </div>
              <div className="card-description">Your best performing products</div>
            </div>
            <div className="card-content">
              {topSellingItems.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📦</div>
                  <div className="empty-title">No items available</div>
                  <div className="empty-description">Add products to see top selling items</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {topSellingItems.map((item) => (
                    <div key={item.id} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      padding: '12px', 
                      borderRadius: '8px', 
                      backgroundColor: 'rgba(249, 250, 251, 0.5)' 
                    }}>
                      <div>
                        <div style={{ fontWeight: '500', fontSize: '14px' }}>{item.name}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>Sold: {item.soldCount}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '500', fontSize: '14px' }}>${item.price}</div>
                        <span style={{
                          display: 'inline-block',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: '500',
                          backgroundColor: 'transparent',
                          color: '#6b7280',
                          border: '1px solid #d1d5db'
                        }}>
                          {item.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Previous Receipts */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <span>📅</span>
                Previous Receipts
              </div>
              <div className="card-description">Recent transactions</div>
            </div>
            <div className="card-content">
              {previousReceipts.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🧾</div>
                  <div className="empty-title">No receipts issued yet</div>
                  <div className="empty-description">Start issuing receipts to see transaction history</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {previousReceipts.map((receipt) => (
                    <div key={receipt.id} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      padding: '12px', 
                      borderRadius: '8px', 
                      backgroundColor: 'rgba(249, 250, 251, 0.5)' 
                    }}>
                      <div>
                        <div style={{ fontWeight: '500', fontSize: '14px' }}>{receipt.customerName}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{receipt.date}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '500', fontSize: '14px' }}>${receipt.amount}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{receipt.items} items</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button className="btn-outline" style={{ width: '100%', marginTop: '16px' }}>
                View All Receipts
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
