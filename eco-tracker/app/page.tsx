"use client"

import { useState } from "react"
import { AuthModal } from "@/components/auth-modal"
import { CustomerDashboard } from "@/components/customer-dashboard"
import { ShopkeeperDashboard } from "@/components/shopkeeper-dashboard"
import { type User } from "@/lib/api"

interface ShopItem {
  id: number
  name: string
  price: number
  category: string
}

export default function HomePage() {
  const [showAuthModal, setShowAuthModal] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<"customer" | "shop-owner" | null>(null)
  const [shopItems, setShopItems] = useState<ShopItem[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const handleAuthClose = (userType?: "customer" | "shop-owner", items?: ShopItem[], user?: User) => {
    if (userType && user) {
      setShowAuthModal(false)
      setIsAuthenticated(true)
      setUserRole(userType === "shop-owner" ? "shop-owner" : "customer")
      setCurrentUser(user)
      if (userType === "shop-owner" && items) {
        setShopItems(items)
      }
    }
  }

  const handleLogout = () => {
    setShowAuthModal(true)
    setIsAuthenticated(false)
    setUserRole(null)
    setShopItems([])
    setCurrentUser(null)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {showAuthModal && <AuthModal onClose={handleAuthClose} />}
      
      {isAuthenticated && userRole === "customer" && (
        <CustomerDashboard onLogout={handleLogout} user={currentUser} />
      )}
      
      {isAuthenticated && userRole === "shop-owner" && (
        <ShopkeeperDashboard 
          onLogout={handleLogout} 
          shopItems={shopItems}
          user={currentUser}
        />
      )}
    </div>
  )
}
