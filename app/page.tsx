"use client"

import { useState } from "react"
import { AuthModal } from "@/components/auth-modal"
import { CustomerDashboard } from "@/components/customer-dashboard"
import { ShopkeeperDashboard } from "@/components/shopkeeper-dashboard"

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

  const handleAuthClose = (userType?: "customer" | "shop-owner", items?: ShopItem[]) => {
    if (userType) {
      setShowAuthModal(false)
      setIsAuthenticated(true)
      setUserRole(userType === "shop-owner" ? "shop-owner" : "customer")
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
  }

  if (showAuthModal) {
    return <AuthModal onClose={handleAuthClose} />
  }

  if (userRole === "shop-owner") {
    return <ShopkeeperDashboard onLogout={handleLogout} shopItems={shopItems} />
  }

  return <CustomerDashboard onLogout={handleLogout} />
}
