// app/dashboard/components/ChartsGrid.tsx
"use client"

import { useState, useEffect } from "react"
import { Maximize2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts"
import { mockPatentData, mockFundingData, mockTRLDistribution, mockActivities } from "@/lib/mock-data"

interface ChartsGridProps {
  widgets: {
    patents: boolean
    funding: boolean
    trl: boolean
    activity: boolean
  }
  timeRange: string
}

function PatentChart({ timeRange }: { timeRange: string }) {
  const [data] = useState(mockPatentData.slice(0, timeRange === "7d" ? 4 : timeRange === "30d" ? 7 : 10))

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Patent Filings & Citations</CardTitle>
          <Button variant="ghost" size="icon">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>Weekly trends over the last {timeRange === "7d" ? "week" : timeRange === "30d" ? "month" : "year"}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorFilings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorCitations" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="date" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
            <Legend />
            <Area type="monotone" dataKey="filings" stroke="#3b82f6" fill="url(#colorFilings)" name="Filings" />
            <Area type="monotone" dataKey="citations" stroke="#10b981" fill="url(#colorCitations)" name="Citations" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

function FundingChart({ timeRange }: { timeRange: string }) {
  const months = timeRange === "7d" ? 3 : timeRange === "30d" ? 6 : 12
  const data = mockFundingData.slice(-months)

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Funding & Investment Trends</CardTitle>
        <CardDescription>Venture capital and R&D investments (in millions)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" className="text-xs" />
            <YAxis className="text-xs" tickFormatter={(v) => `$${(v / 1000000).toFixed(0)}M`} />
            <Tooltip formatter={(v: number) => `$${ (v / 1000000).toFixed(1) }M`} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
            <Bar dataKey="amount" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

function TRLDistributionChart() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>TRL Distribution</CardTitle>
        <CardDescription>Technology Readiness Levels</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={mockTRLDistribution}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {mockTRLDistribution.map((entry, i) => (
                <Cell key={`cell-${i}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 space-y-2">
          {mockTRLDistribution.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}</span>
              </div>
              <span className="font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ActivityFeed() {
  const formatTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours < 1) return "Just now"
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Activity</CardTitle>
          <Button variant="ghost" size="sm">View All</Button>
        </div>
        <CardDescription>Latest technology events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockActivities.map((a) => (
            <div key={a.id} className="flex gap-3 text-sm">
              <div className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-sm">{a.description}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
                  <Badge variant="outline">{a.type}</Badge>
                  <span>{a.tech}</span>
                  <span>•</span>
                  <span>{formatTime(a.timestamp)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function ChartsGrid({ widgets, timeRange }: ChartsGridProps) {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-min">
      {widgets.patents && <PatentChart timeRange={timeRange} />}
      {widgets.funding && <FundingChart timeRange={timeRange} />}
      {widgets.trl && <TRLDistributionChart />}
      {widgets.activity && <ActivityFeed />}
    </div>
  )
}