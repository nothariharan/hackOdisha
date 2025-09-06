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

interface ShopItem {
  id: number
  name: string
  price: number
  category: string
}

interface AuthModalProps {
  onClose: (userType?: "customer" | "shop-owner", shopItems?: ShopItem[]) => void
}

export function AuthModal({ onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [userType, setUserType] = useState<"customer" | "shop-owner">("customer")
  const [productList, setProductList] = useState("")

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const shopItems = userType === "shop-owner" ? parseProductList(productList) : undefined
    onClose(userType, shopItems)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 animate-fade-in overflow-y-auto">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/90 to-teal-50/90 backdrop-blur-sm" />

      {/* Modal */}
      <Card className="relative w-full max-w-md glass shadow-2xl border-0 my-8 min-h-fit">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center p-2">
            <Image
              src="/logo.png"
              alt="EcoTrack Logo"
              width={48}
              height={48}
              className="rounded-full"
            />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-balance">Welcome to EcoTrack</CardTitle>
            <CardDescription className="text-muted-foreground">Track your sustainability journey</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={userType === "customer" ? "default" : "outline"}
              onClick={() => setUserType("customer")}
              className="h-auto p-4 flex flex-col gap-2"
            >
              <span className="text-xl">👤</span>
              <span className="text-sm">Customer</span>
            </Button>
            <Button
              variant={userType === "shop-owner" ? "default" : "outline"}
              onClick={() => setUserType("shop-owner")}
              className="h-auto p-4 flex flex-col gap-2"
            >
              <span className="text-xl">🏪</span>
              <span className="text-sm">Shop Owner</span>
            </Button>
          </div>

          {/* Auth Tabs */}
          <Tabs value={isLogin ? "login" : "signup"} onValueChange={(value) => setIsLogin(value === "login")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 mt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {userType === "customer" ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="Enter your phone number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Enter your email" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="shop-name">Shop Name</Label>
                      <Input id="shop-name" placeholder="Enter your shop name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Enter your email" />
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Enter your password" />
                </div>
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 mt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {userType === "customer" ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="signup-phone">Phone Number</Label>
                      <Input id="signup-phone" type="tel" placeholder="Enter your phone number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input id="signup-email" type="email" placeholder="Enter your email" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="signup-shop-name">Shop Name</Label>
                      <Input id="signup-shop-name" placeholder="Enter your shop name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input id="signup-email" type="email" placeholder="Enter your email" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product-list">Product List</Label>
                      <Textarea
                        id="product-list"
                        placeholder="Enter your products in format: Product Name, $Price, Category&#10;Example:&#10;Organic Apples, $3.99, Food&#10;Reusable Bottle, $12.99, Eco-Friendly"
                        className="min-h-20"
                        value={productList}
                        onChange={(e) => setProductList(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Format: Product Name, $Price, Category (one per line)
                      </p>
                      <Button type="button" variant="outline" size="sm" className="w-full bg-transparent">
                        <span className="mr-2">📤</span>
                        Upload CSV
                      </Button>
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" type="password" placeholder="Create a password" />
                </div>
                <Button type="submit" className="w-full">
                  Sign Up
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
