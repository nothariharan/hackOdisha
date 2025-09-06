"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground text-balance">Shop Management Dashboard</h1>
            <p className="text-muted-foreground">Manage your shop items and issue receipts</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 glass rounded-lg px-4 py-2">
              <span className="text-lg">🏪</span>
              <span className="font-semibold">ShopKeeper Portal</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="glass border-0 hover:bg-destructive/10 hover:text-destructive bg-transparent"
            >
              Logout
            </Button>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={() => setShowIssueReceipt(!showIssueReceipt)}
            className="bg-primary hover:bg-primary/90 px-12 py-4 text-xl font-semibold shadow-lg"
            size="lg"
          >
            🧾 Issue Receipt
          </Button>
        </div>

        {/* Issue Receipt Form */}
        {showIssueReceipt && (
          <Card className="glass border border-emerald-200/30 shadow-sm max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">🧾 Issue New Receipt</CardTitle>
              <CardDescription>Enter customer details and select items</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="customer">Customer Username or Phone Number</Label>
                <Input
                  id="customer"
                  placeholder="Enter username or phone number"
                  value={customerIdentifier}
                  onChange={(e) => setCustomerIdentifier(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div>
                <Label>Select Items</Label>
                {shopItems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="text-4xl mb-4">🏪</div>
                    <p className="text-lg font-medium">Shop is empty</p>
                    <p className="text-sm">Add products to your shop to start issuing receipts</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    {shopItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                        <div>
                          <div className="font-medium text-sm">{item.name}</div>
                          <div className="text-xs text-muted-foreground">${item.price}</div>
                          <Badge variant="outline" className="text-xs mt-1">
                            {item.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleItemQuantityChange(item.id.toString(), (selectedItems[item.id.toString()] || 0) - 1)
                            }
                            disabled={(selectedItems[item.id.toString()] || 0) <= 0}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center text-sm">{selectedItems[item.id.toString()] || 0}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleItemQuantityChange(item.id.toString(), (selectedItems[item.id.toString()] || 0) + 1)
                            }
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button onClick={handleIssueReceipt} disabled={!customerIdentifier.trim() || shopItems.length === 0}>
                  Issue Receipt
                </Button>
                <Button variant="outline" onClick={() => setShowIssueReceipt(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass border border-emerald-200/30 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">📈 Top Selling Items</CardTitle>
              <CardDescription>Your best performing products</CardDescription>
            </CardHeader>
            <CardContent>
              {topSellingItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  📦<p className="mt-4">No items available</p>
                  <p className="text-sm">Add products to see top selling items</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {topSellingItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                      <div>
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-muted-foreground">Sold: {item.soldCount}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-sm">${item.price}</div>
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Previous Receipts */}
          <Card className="glass border border-emerald-200/30 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">📅 Previous Receipts</CardTitle>
              <CardDescription>Recent transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {previousReceipts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  🧾<p className="mt-4">No receipts issued yet</p>
                  <p className="text-sm">Start issuing receipts to see transaction history</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {previousReceipts.map((receipt) => (
                    <div key={receipt.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                      <div>
                        <div className="font-medium text-sm">{receipt.customerName}</div>
                        <div className="text-xs text-muted-foreground">{receipt.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-sm">${receipt.amount}</div>
                        <div className="text-xs text-muted-foreground">{receipt.items} items</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                View All Receipts
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
