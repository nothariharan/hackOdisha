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
    { name: "Zero Waste Day", earned: true, icon: "♻️" },
    { name: "Bike to Work", earned: false, icon: "🚴" },
    { name: "Local Shopping", earned: true, icon: "🛍️" },
  ]

  const recentActivities = [
    { action: "Bought organic apples", points: 10, time: "2 hours ago" },
    { action: "Used reusable bag", points: 5, time: "1 day ago" },
    { action: "Recycled plastic bottles", points: 15, time: "2 days ago" },
  ]

  const totalPoints = 150
  const nextMilestone = 200

  return (
    <div className="dashboard">
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Your Eco Journey</h1>
            <p className="dashboard-subtitle">Track your sustainable choices and earn rewards</p>
          </div>
          <div className="dashboard-nav">
            <div className="nav-item">
              <Image
                src="/logo.png"
                alt="EcoTrack Logo"
                width={24}
                height={24}
                style={{ borderRadius: '50%' }}
              />
              <span>EcoTrack</span>
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
            <div className="stat-description">Keep going!</div>
          </div>

          <div className="stat-card">
            <div className="stat-title">This Week</div>
            <div className="stat-value">3</div>
            <div className="stat-description">Eco-friendly actions</div>
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
                      {challenge.earned ? "Completed" : "In Progress"}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
