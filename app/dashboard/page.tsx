// app/dashboard/page.tsx
"use client"

import { useState } from "react"
import DashboardHeader from "./components/DashboardHeader"
import SearchBar from "./components/SearchBar"
import KPICards from "./components/KPICards"
import TopSignals from "./components/TopSignals"
import TimeRangeSelector from "./components/TimeRangeSelector"
import ChartsGrid from "./components/ChartsGrid"
import { mockKPIs, mockSignals } from "@/lib/mock-data"

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [timeRange, setTimeRange] = useState("30d")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(r => setTimeout(r, 800))
    setIsRefreshing(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        
        {/* Header */}
        <DashboardHeader
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
        />

        {/* Search bar */}
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* KPI Cards */}
        <KPICards kpis={mockKPIs} />

        {/* 🔥 Top Signals Component Added Here */}
        <TopSignals signals={mockSignals} />

        {/* Time Range Selector */}
        <div className="flex justify-end">
          <TimeRangeSelector
            timeRange={timeRange}
            setTimeRange={setTimeRange}
          />
        </div>

        {/* Charts Grid */}
        <ChartsGrid
          widgets={{
            patents: true,
            funding: true,
            trl: true,
            activity: true,
          }}
          timeRange={timeRange}
        />
      </div>
    </div>
  )
}
