"use client"

import type React from "react"
import Image from "next/image"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ApiService, type User } from "@/lib/api"

interface ShopItem {
  id: number
  name: string
  price: number
  category: string
}

interface AuthModalProps {
  onClose: (userType?: "customer" | "shop-owner", shopItems?: ShopItem[], user?: User) => void
}

export function AuthModal({ onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [userType, setUserType] = useState<"customer" | "shop-owner">("customer")
  const [productList, setProductList] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const parseProductList = (productText: string): ShopItem[] => {
    if (!productText.trim()) return []
    
    const lines = productText.split('\n').filter(line => line.trim())
    const items: ShopItem[] = []
    
    lines.forEach((line, index) => {
      // Try to parse format: "Product Name, $Price, Category"
      const parts = line.split(',').map(part => part.trim())
      if (parts.length >= 2) {
        const name = parts[0]
        const priceStr = parts[1].replace('$', '').trim()
        const price = parseFloat(priceStr) || 0
        const category = parts[2] || "General"
        
        if (name && price > 0) {
          items.push({
            id: index + 1,
            name,
            price,
            category
          })
        }
      }
    })
    
    return items
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const formData = new FormData(e.target as HTMLFormElement)
      
      if (isLogin) {
        // Handle login
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        
        if (!email || !password) {
          setError("Please fill in all fields")
          return
        }

        const user = await ApiService.loginUser({ email, password })
        const shopItems = userType === "shop-owner" ? parseProductList(productList) : undefined
        onClose(userType, shopItems, user)
        
      } else {
        // Handle registration
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const name = formData.get('name') as string
        
        // For shop owners, we don't require phone field
        const phone = userType === "customer" ? formData.get('phone') as string : "0000000000"
        
        if (!email || !password || !name || (userType === "customer" && !phone)) {
          setError("Please fill in all fields")
          return
        }

        if (userType === "customer") {
          // Customer registration
          const user = await ApiService.registerUser({ email, password, name, phone })
          onClose(userType, undefined, user)
        } else {
          // Shop owner registration with items
          const shopItems = parseProductList(productList)
          const user = await ApiService.registerShop({ 
            email, 
            password, 
            name, 
            address: "Default Address", 
            phone, 
            description: "Eco-friendly shop" 
          }, shopItems)
          onClose(userType, shopItems, user)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="modal">
      {/* Backdrop */}
      <div className="modal-backdrop" />

      {/* Modal */}
      <div className="modal-content">
        <div className="header">
          <div className="logo-container" style={{ width: '100px', height: '100px', margin: '0 auto 24px' }}>
            <Image
              src="/logo.png"
              alt="EcoTrack Logo"
              width={90}
              height={90}
              style={{ borderRadius: '50%' }}
            />
          </div>
          <div>
            <h1 className="title">Welcome to EcoTrack</h1>
            <p className="subtitle">Track your sustainability journey</p>
          </div>
        </div>

        <div className="content">
          {/* Error Message */}
          {error && (
            <div style={{ 
              backgroundColor: '#fee2e2', 
              color: '#dc2626', 
              padding: '12px', 
              borderRadius: '8px', 
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          {/* Role Selection */}
          <div className="role-grid">
            <button
              className={`role-btn ${userType === "customer" ? "active" : ""}`}
              onClick={() => setUserType("customer")}
            >
              <span style={{ fontSize: '20px' }}></span>
              <span style={{ fontSize: '14px' }}>Customer</span>
            </button>
            <button
              className={`role-btn ${userType === "shop-owner" ? "active" : ""}`}
              onClick={() => setUserType("shop-owner")}
            >
              <span style={{ fontSize: '20px' }}></span>
              <span style={{ fontSize: '14px' }}>Shop Owner</span>
            </button>
          </div>

          {/* Auth Tabs */}
          <div className="tabs">
            <button
              className={`tab ${isLogin ? "active" : ""}`}
              onClick={() => setIsLogin(true)}
            >
              Sign In
            </button>
            <button
              className={`tab ${!isLogin ? "active" : ""}`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>

          {/* Forms */}
          {isLogin ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {userType === "customer" ? (
                <>
                  <div className="form-group">
                    <label className="label" htmlFor="phone">Phone Number</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      className="input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="label" htmlFor="email">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="input"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label className="label" htmlFor="shop-name">Shop Name</label>
                    <input
                      id="shop-name"
                      name="name"
                      placeholder="Enter your shop name"
                      className="input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="label" htmlFor="email">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="input"
                    />
                  </div>
                </>
              )}
              <div className="form-group">
                <label className="label" htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="input"
                />
              </div>
              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {userType === "customer" ? (
                <>
                  <div className="form-group">
                    <label className="label" htmlFor="signup-name">Full Name</label>
                    <input
                      id="signup-name"
                      name="name"
                      placeholder="Enter your full name"
                      className="input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="label" htmlFor="signup-phone">Phone Number</label>
                    <input
                      id="signup-phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      className="input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="label" htmlFor="signup-email">Email</label>
                    <input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="input"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label className="label" htmlFor="signup-shop-name">Shop Name</label>
                    <input
                      id="signup-shop-name"
                      name="name"
                      placeholder="Enter your shop name"
                      className="input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="label" htmlFor="signup-email">Email</label>
                    <input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="label" htmlFor="product-list">Product List</label>
                    <textarea
                      id="product-list"
                      placeholder="Enter your products in format: Product Name, $Price, Category&#10;Example:&#10;Organic Apples, $3.99, Food&#10;Reusable Bottle, $12.99, Eco-Friendly"
                      style={{ minHeight: '80px', width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', resize: 'vertical' }}
                      value={productList}
                      onChange={(e) => setProductList(e.target.value)}
                    />
                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                      Format: Product Name, $Price, Category (one per line)
                    </p>
                    <button type="button" className="btn-outline" style={{ width: '100%', marginTop: '8px' }}>
                      <span style={{ marginRight: '8px' }}></span>
                      Upload CSV
                    </button>
                  </div>
                </>
              )}
              <div className="form-group">
                <label className="label" htmlFor="signup-password">Password</label>
                <input
                  id="signup-password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  className="input"
                />
              </div>
              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Sign Up"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
