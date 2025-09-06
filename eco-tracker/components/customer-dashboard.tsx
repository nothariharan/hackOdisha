"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import { type User } from "@/lib/api"

interface CustomerDashboardProps {
  onLogout: () => void
  user: User | null
}

export function CustomerDashboard({ onLogout, user }: CustomerDashboardProps) {
  const challenges = [
    { name: "Eco-Friendly Shopping", earned: false, icon: "", description: "Buy 5 organic products" },
    { name: "Fruit & Veggie Lover", earned: false, icon: "", description: "Purchase 10 fruits/vegetables" },
    { name: "Sustainable Living", earned: false, icon: "", description: "Buy 3 eco-friendly items" },
    { name: "Plastic Free Week", earned: false, icon: "", description: "Only purchased less than 5 plastic items" },
  ]

  const totalPoints = user?.points || 0
  const userName = user?.name || "Customer"

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
            Your Eco Journey
          </h1>
          <div style={{
            height: '4px',
            background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c)',
            borderRadius: '2px',
            margin: '0 auto 24px',
            width: '200px',
            animation: 'pulse 2s ease-in-out infinite alternate'
          }}></div>
          <p className="dashboard-subtitle">Welcome back, {userName}! Keep up the great work.</p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-title">Total Points</div>
            <div className="stat-value">{totalPoints}</div>
            <div className="stat-description">Earned from eco-friendly purchases</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Challenges Completed</div>
            <div className="stat-value">{challenges.filter(c => c.earned).length}</div>
            <div className="stat-description">Out of {challenges.length} challenges</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Progress Towards Milestone</div>
            <div className="stat-value">{Math.floor(totalPoints / 100)}%</div>
            <div className="stat-description">Next milestone: {Math.ceil(totalPoints / 100) * 100} points</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="cards-grid">
          {/* Challenges Section */}
          <Card className="card">
            <CardHeader className="card-header">
              <CardTitle className="card-title"> Eco Challenges</CardTitle>
              <CardDescription className="card-description">
                Complete challenges to earn more points and badges
              </CardDescription>
            </CardHeader>
            <CardContent className="card-content">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {challenges.map((challenge, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    padding: '12px',
                    backgroundColor: challenge.earned ? '#f0fdf4' : '#f9fafb',
                    borderRadius: '8px',
                    border: challenge.earned ? '2px solid #22c55e' : '1px solid #e5e7eb'
                  }}>
                    <span style={{ fontSize: '24px' }}>{challenge.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>{challenge.name}</div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>{challenge.description}</div>
                    </div>
                    {challenge.earned && (
                      <Badge style={{ backgroundColor: '#22c55e', color: 'white' }}>
                         Completed
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="card">
            <CardHeader className="card-header">
              <CardTitle className="card-title"> Recent Activities</CardTitle>
              <CardDescription className="card-description">
                Your latest eco-friendly actions
              </CardDescription>
            </CardHeader>
            <CardContent className="card-content">
              <div className="empty-state">
                <div className="empty-icon"></div>
                <div className="empty-title">No activities yet</div>
                <div className="empty-description">
                  Start shopping at eco-friendly stores to see your activities here
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Latest Purchases */}
          <Card className="card" style={{ gridColumn: '1 / -1' }}>
            <CardHeader className="card-header">
              <CardTitle className="card-title"> Latest Purchases</CardTitle>
              <CardDescription className="card-description">
                Your recent eco-friendly purchases and receipts
              </CardDescription>
            </CardHeader>
            <CardContent className="card-content">
              <div style={{ 
                display: 'flex', 
                gap: '16px', 
                overflowX: 'auto', 
                padding: '16px 0',
                scrollbarWidth: 'thin'
              }}>
                <div className="empty-state" style={{ minWidth: '300px', textAlign: 'center' }}>
                  <div className="empty-icon"></div>
                  <div className="empty-title">No purchases so far</div>
                  <div className="empty-description">
                    Visit eco-friendly shops and get receipts to see your purchases here
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
