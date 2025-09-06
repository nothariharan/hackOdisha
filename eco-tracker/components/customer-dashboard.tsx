"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import Image from "next/image"
import { type User, type Receipt, type Challenge, ApiService } from "@/lib/api"

interface CustomerDashboardProps {
  onLogout: () => void
  user: User | null
}

export function CustomerDashboard({ onLogout, user }: CustomerDashboardProps) {
  const [totalPoints, setTotalPoints] = useState(0)
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [latestPurchases, setLatestPurchases] = useState<Receipt[]>([])
  const [showReceiptNotification, setShowReceiptNotification] = useState(false)
  const [newReceipt, setNewReceipt] = useState<Receipt | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      fetchUserData()
    }
  }, [user?.id])

  const fetchUserData = async () => {
    if (!user?.id) return

    try {
      setIsLoading(true)
      
      // Fetch user receipts, challenges, and points
      const [receipts, userChallenges, userData] = await Promise.all([
        ApiService.getUserReceipts(user.id),
        ApiService.getUserChallenges(user.id),
        ApiService.getUser(user.id)
      ])

      // Update state
      setLatestPurchases(receipts || [])
      setChallenges(userChallenges || [])
      setTotalPoints(userData?.points || 0)

      // Check for new receipts (compare with localStorage)
      const lastReceiptCount = localStorage.getItem(`lastReceiptCount_${user.id}`)
      const currentReceiptCount = receipts?.length || 0
      
      if (lastReceiptCount && currentReceiptCount > parseInt(lastReceiptCount)) {
        // New receipt received!
        const newestReceipt = receipts[receipts.length - 1]
        setNewReceipt(newestReceipt)
        setShowReceiptNotification(true)
      }

      // Update localStorage
      localStorage.setItem(`lastReceiptCount_${user.id}`, currentReceiptCount.toString())

      // Generate recent activities based on receipts
      const activities = receipts?.map(receipt => ({
        id: receipt.id,
        type: "purchase",
        title: "Eco-friendly purchase completed",
        description: `Earned ${receipt.points_earned} points`,
        timestamp: receipt.created_at,
        points: receipt.points_earned
      })) || []

      setRecentActivities(activities)

    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const closeReceiptNotification = () => {
    setShowReceiptNotification(false)
    setNewReceipt(null)
  }

  const handleDeleteReceipt = async (receiptId: number) => {
    if (confirm('Are you sure you want to delete this receipt? This will also subtract the earned points.')) {
      try {
        await ApiService.deleteReceipt(receiptId)
        // Refresh data to show updated state
        await fetchUserData()
      } catch (error) {
        console.error('Error deleting receipt:', error)
        alert('Failed to delete receipt. Please try again.')
      }
    }
  }

  const getProgressPercentage = (progress: number, target: number) => {
    return Math.min((progress / target) * 100, 100)
  }

  if (isLoading) {
    return (
      <div className="dashboard">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '16px' }}></div>
            <div>Loading your eco journey...</div>
          </div>
        </div>
      </div>
    )
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
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={fetchUserData} className="btn-outline">
            🔄 Refresh
          </button>
          <button onClick={onLogout} className="btn-outline">
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Welcome Section */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="dashboard-title" style={{ 
            background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '16px'
          }}>
            Your Eco Journey
          </h1>
          <p className="dashboard-subtitle">Track your sustainable choices and earn rewards</p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-title">Total Points</div>
            <div className="stat-value">{totalPoints}</div>
            <div className="stat-description">Eco points earned</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Challenges</div>
            <div className="stat-value">{challenges.filter(c => c.earned).length}/{challenges.length}</div>
            <div className="stat-description">Completed challenges</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Purchases</div>
            <div className="stat-value">{latestPurchases.length}</div>
            <div className="stat-description">Eco-friendly purchases</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="cards-grid">
          {/* Challenges */}
          <Card className="card">
            <CardHeader className="card-header">
              <CardTitle className="card-title"> Eco Challenges</CardTitle>
              <CardDescription className="card-description">
                Complete challenges to earn more points
              </CardDescription>
            </CardHeader>
            <CardContent className="card-content">
              {challenges.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon"></div>
                  <div className="empty-title">No challenges available</div>
                  <div className="empty-description">
                    Start making eco-friendly purchases to unlock challenges
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {challenges.map((challenge) => (
                    <div key={challenge.id} style={{ 
                      padding: '16px', 
                      backgroundColor: challenge.earned ? '#f0fdf4' : '#f9fafb',
                      borderRadius: '8px',
                      border: challenge.earned ? '1px solid #10b981' : '1px solid #e5e7eb'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '20px' }}>{challenge.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                            {challenge.name}
                            {challenge.earned && <Badge style={{ marginLeft: '8px', backgroundColor: '#10b981' }}>Completed</Badge>}
                          </div>
                          <div style={{ fontSize: '14px', color: '#6b7280' }}>
                            {challenge.description}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Progress 
                          value={getProgressPercentage(challenge.progress, challenge.target)} 
                          style={{ flex: 1, height: '8px' }}
                        />
                        <span style={{ fontSize: '12px', color: '#6b7280', minWidth: '60px' }}>
                          {challenge.progress}/{challenge.target}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
              {recentActivities.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon"></div>
                  <div className="empty-title">No activities yet</div>
                  <div className="empty-description">
                    Start shopping at eco-friendly stores to see your activities
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {recentActivities.slice(0, 5).map((activity) => (
                    <div key={activity.id} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px',
                      padding: '12px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{ fontSize: '20px' }}></div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', marginBottom: '2px' }}>{activity.title}</div>
                        <div style={{ fontSize: '14px', color: '#6b7280' }}>{activity.description}</div>
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Latest Purchases */}
          <Card className="card" style={{ gridColumn: 'span 2' }}>
            <CardHeader className="card-header">
              <CardTitle className="card-title"> Latest Purchases</CardTitle>
              <CardDescription className="card-description">
                Your recent eco-friendly purchases
              </CardDescription>
            </CardHeader>
            <CardContent className="card-content">
              {latestPurchases.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon"></div>
                  <div className="empty-title">No purchases so far</div>
                  <div className="empty-description">
                    Start shopping at eco-friendly stores to see your purchases here
                  </div>
                </div>
              ) : (
                <div style={{ 
                  display: 'flex', 
                  gap: '16px', 
                  overflowX: 'auto', 
                  paddingBottom: '8px',
                  scrollbarWidth: 'thin'
                }}>
                  {latestPurchases.map((purchase) => (
                    <div key={purchase.id} style={{ 
                      minWidth: '200px',
                      padding: '16px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{ fontWeight: '600', marginBottom: '8px' }}>
                        Purchase #{purchase.id}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                        {new Date(purchase.created_at).toLocaleDateString()}
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: '600', color: '#059669', marginBottom: '4px' }}>
                        ${purchase.total_amount.toFixed(2)}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                        +{purchase.points_earned} points earned
                      </div>
                      <button 
                        onClick={() => handleDeleteReceipt(purchase.id)}
                        style={{
                          backgroundColor: '#fee2e2',
                          color: '#dc2626',
                          border: '1px solid #fecaca',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          width: '100%'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = '#fecaca'
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = '#fee2e2'
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Receipt Notification Modal */}
      {showReceiptNotification && newReceipt && (
        <div className="modal">
          <div className="modal-backdrop" onClick={closeReceiptNotification} />
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="header">
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
                 New Receipt Received!
              </h2>
            </div>
            <div className="content">
              <div style={{ 
                backgroundColor: '#f0fdf4',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '16px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}></div>
                <div style={{ color: '#16a34a', fontWeight: '600', fontSize: '18px' }}>
                  Receipt #{newReceipt.id} Received!
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                  Thank you for your eco-friendly purchase
                </div>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <strong>Purchase Amount:</strong> ${newReceipt.total_amount.toFixed(2)}
              </div>
              <div style={{ marginBottom: '16px' }}>
                <strong>Points Earned:</strong> {newReceipt.points_earned} 
              </div>
              <div style={{ marginBottom: '16px' }}>
                <strong>Date:</strong> {new Date(newReceipt.created_at).toLocaleString()}
              </div>
              
              <div style={{ 
                backgroundColor: '#fef3c7',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '16px',
                textAlign: 'center'
              }}>
                <div style={{ color: '#d97706', fontWeight: '600' }}>
                   Your total points: {totalPoints + newReceipt.points_earned}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                  Keep shopping eco-friendly to earn more rewards!
                </div>
              </div>
              
              <button onClick={closeReceiptNotification} className="btn-primary" style={{ width: '100%' }}>
                Awesome! Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
