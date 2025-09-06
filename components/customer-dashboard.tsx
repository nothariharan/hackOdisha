"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"

interface CustomerDashboardProps {
  onLogout: () => void
}

export function CustomerDashboard({ onLogout }: CustomerDashboardProps) {
  const challenges = [
    { name: "Plastic-Free Week", earned: false, icon: "🌱" },
    { name: "Zero Waste Day", earned: false, icon: "♻️" },
    { name: "Bike to Work", earned: false, icon: "🚴" },
    { name: "Local Shopping", earned: false, icon: "🛍️" },
  ]

  const recentActivities = [
    // Empty for now - will be populated when shopkeeper sends receipts
  ]

  const latestPurchases = [
    // Empty for now - will be populated when shopkeeper sends receipts
  ]

  const totalPoints = 0
  const nextMilestone = 100

  return (
    <div className="dashboard">
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Your Eco Journey</h1>
            <p className="dashboard-subtitle">Track your sustainable choices and earn rewards</p>
            <div style={{
              width: '100%',
              height: '3px',
              background: 'linear-gradient(90deg, #22c55e, #16a34a, #15803d)',
              borderRadius: '2px',
              marginTop: '12px',
              boxShadow: '0 2px 4px rgba(34, 197, 94, 0.3)'
            }}></div>
          </div>
          <div className="dashboard-nav">
            <div className="nav-item" style={{ padding: '16px 20px' }}>
              <Image
                src="/logo.png"
                alt="EcoTrack Logo"
                width={32}
                height={32}
                style={{ borderRadius: '50%' }}
              />
              <span style={{ fontSize: '18px', fontWeight: '700' }}>EcoTrack</span>
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

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-title">Total Points</div>
            <div className="stat-value">{totalPoints}</div>
            <div className="stat-description">Next milestone: {nextMilestone}</div>
          </div>

          <div className="stat-card">
            <div className="stat-title">Challenges Completed</div>
            <div className="stat-value">{challenges.filter(c => c.earned).length}/{challenges.length}</div>
            <div className="stat-description">Start your eco journey!</div>
          </div>

          <div className="stat-card">
            <div className="stat-title">This Week</div>
            <div className="stat-value">0</div>
            <div className="stat-description">Eco-friendly actions</div>
          </div>
        </div>

        {/* Latest Purchases Section */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <span>🛒</span>
              Latest Purchases
            </div>
            <div className="card-description">Your recent eco-friendly purchases from local shops</div>
          </div>
          <div className="card-content">
            {latestPurchases.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🛍️</div>
                <div className="empty-title">No purchases so far</div>
                <div className="empty-description">Make your first eco-friendly purchase to see it here!</div>
              </div>
            ) : (
              <div style={{ 
                display: 'flex', 
                gap: '16px', 
                overflowX: 'auto', 
                paddingBottom: '8px',
                scrollbarWidth: 'thin',
                scrollbarColor: '#22c55e #f0f0f0'
              }}>
                {latestPurchases.map((purchase, index) => (
                  <div key={index} style={{
                    minWidth: '280px',
                    padding: '16px',
                    backgroundColor: 'rgba(249, 250, 251, 0.5)',
                    borderRadius: '8px',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '600', fontSize: '14px' }}>{purchase.shopName}</span>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>{purchase.date}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      {purchase.items.length} item{purchase.items.length !== 1 ? 's' : ''}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {purchase.items.slice(0, 2).map((item, idx) => (
                        <div key={idx} style={{ fontSize: '12px', color: '#374151' }}>
                          • {item.name} x{item.quantity}
                        </div>
                      ))}
                      {purchase.items.length > 2 && (
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          +{purchase.items.length - 2} more items
                        </div>
                      )}
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginTop: '8px',
                      paddingTop: '8px',
                      borderTop: '1px solid rgba(34, 197, 94, 0.1)'
                    }}>
                      <span style={{ fontWeight: '600', color: '#22c55e' }}>${purchase.totalAmount}</span>
                      <span style={{ fontSize: '12px', color: '#22c55e' }}>+{purchase.pointsEarned} pts</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="cards-grid">
          {/* Challenges */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <span>🏆</span>
                Challenges
              </div>
              <div className="card-description">Complete challenges to earn more points</div>
            </div>
            <div className="card-content">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {challenges.map((challenge) => (
                  <div key={challenge.name} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '12px', 
                    borderRadius: '8px', 
                    backgroundColor: 'rgba(249, 250, 251, 0.5)' 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '18px' }}>{challenge.icon}</span>
                      <span style={{ fontWeight: '500', fontSize: '14px' }}>{challenge.name}</span>
                    </div>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: challenge.earned ? '#22c55e' : 'transparent',
                      color: challenge.earned ? 'white' : '#6b7280',
                      border: challenge.earned ? 'none' : '1px solid #d1d5db'
                    }}>
                      {challenge.earned ? "Completed" : "Not Started"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <span>📈</span>
                Recent Activities
              </div>
              <div className="card-description">Your latest eco-friendly actions</div>
            </div>
            <div className="card-content">
              {recentActivities.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📊</div>
                  <div className="empty-title">No activities yet</div>
                  <div className="empty-description">Start making eco-friendly purchases to see your activities here!</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {recentActivities.map((activity, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      padding: '12px', 
                      borderRadius: '8px', 
                      backgroundColor: 'rgba(249, 250, 251, 0.5)' 
                    }}>
                      <div>
                        <div style={{ fontWeight: '500', fontSize: '14px' }}>{activity.action}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{activity.time}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '500', fontSize: '14px', color: '#22c55e' }}>+{activity.points} pts</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <span>🎯</span>
              Progress to Next Milestone
            </div>
            <div className="card-description">You're {nextMilestone - totalPoints} points away from your next reward</div>
          </div>
          <div className="card-content">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span>{totalPoints} points</span>
                <span>{nextMilestone} points</span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${(totalPoints / nextMilestone) * 100}%`,
                  height: '100%',
                  backgroundColor: '#22c55e',
                  transition: 'width 0.3s ease'
                }} />
              </div>
              <div style={{ textAlign: 'center', fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                Make your first purchase to start earning points!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
