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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground text-balance">Your Eco Journey</h1>
            <p className="text-muted-foreground">Track your sustainable choices and earn rewards</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 glass rounded-lg px-4 py-2">
              <Image
                src="/logo.png"
                alt="EcoTrack Logo"
                width={24}
                height={24}
                className="rounded-full"
              />
              <span className="font-semibold">EcoTrack</span>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass border border-emerald-200/30 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPoints}</div>
              <p className="text-xs text-muted-foreground">Next milestone: {nextMilestone}</p>
            </CardContent>
          </Card>

          <Card className="glass border border-emerald-200/30 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Challenges Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{challenges.filter(c => c.earned).length}/{challenges.length}</div>
              <p className="text-xs text-muted-foreground">Keep going!</p>
            </CardContent>
          </Card>

          <Card className="glass border border-emerald-200/30 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Eco-friendly actions</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Challenges */}
          <Card className="glass border border-emerald-200/30 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">🏆 Challenges</CardTitle>
              <CardDescription>Complete challenges to earn more points</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {challenges.map((challenge) => (
                  <div key={challenge.name} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{challenge.icon}</span>
                      <span className="font-medium text-sm">{challenge.name}</span>
                    </div>
                    <Badge variant={challenge.earned ? "default" : "outline"}>
                      {challenge.earned ? "Completed" : "In Progress"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="glass border border-emerald-200/30 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">📈 Recent Activities</CardTitle>
              <CardDescription>Your latest eco-friendly actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                    <div>
                      <div className="font-medium text-sm">{activity.action}</div>
                      <div className="text-xs text-muted-foreground">{activity.time}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-sm text-emerald-600">+{activity.points} pts</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Section */}
        <Card className="glass border border-emerald-200/30 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">🎯 Progress to Next Milestone</CardTitle>
            <CardDescription>You're {nextMilestone - totalPoints} points away from your next reward</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{totalPoints} points</span>
                <span>{nextMilestone} points</span>
              </div>
              <Progress value={(totalPoints / nextMilestone) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
