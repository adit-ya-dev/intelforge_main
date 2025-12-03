// lib/mock-data.ts
import {
  Activity,
  FileText,
  TrendingUp,
  Bell,
  Eye,
  DollarSign,
  Sparkles
} from "lucide-react"
import { KPIMetric, Signal, ActivityItem, PatentData, FundingData, TRLData } from "@/types/dashboard"

export const mockKPIs: KPIMetric[] = [
  {
    label: "Technologies Tracked",
    value: 247,
    change: 12,
    changeLabel: "+12 this month",
    icon: Activity,
    trend: "up"
  },
  {
    label: "Patents (Last 30d)",
    value: "1,834",
    change: 8.3,
    changeLabel: "+8.3% vs previous period",
    icon: FileText,
    trend: "up"
  },
  {
    label: "TRL ≥7 Technologies",
    value: 89,
    change: 5,
    changeLabel: "+5 moved to mature",
    icon: TrendingUp,
    trend: "up"
  },
  {
    label: "Active Alerts",
    value: 23,
    change: -2,
    changeLabel: "-2 resolved",
    icon: Bell,
    trend: "down"
  },
  {
    label: "Watched Technologies",
    value: 45,
    change: 3,
    changeLabel: "+3 added",
    icon: Eye,
    trend: "up"
  }
]

export const mockPatentData: PatentData[] = [
  { date: "Jan 01", filings: 145, citations: 89 },
  { date: "Jan 08", filings: 178, citations: 112 },
  { date: "Jan 15", filings: 190, citations: 134 },
  { date: "Jan 22", filings: 223, citations: 156 },
  { date: "Jan 29", filings: 248, citations: 178 },
  { date: "Feb 05", filings: 265, citations: 195 },
  { date: "Feb 12", filings: 290, citations: 210 },
  { date: "Feb 19", filings: 310, citations: 235 },
  { date: "Feb 26", filings: 335, citations: 260 },
  { date: "Mar 05", filings: 380, citations: 295 },
]

export const mockFundingData: FundingData[] = [
  { month: "Jan", amount: 45000000 },
  { month: "Feb", amount: 67000000 },
  { month: "Mar", amount: 89000000 },
  { month: "Apr", amount: 134000000 },
  { month: "May", amount: 178000000 },
  { month: "Jun", amount: 212000000 },
  { month: "Jul", amount: 245000000 },
  { month: "Aug", amount: 298000000 },
  { month: "Sep", amount: 356000000 },
  { month: "Oct", amount: 412000000 },
  { month: "Nov", amount: 489000000 },
  { month: "Dec", amount: 567000000 },
]

export const mockTRLDistribution: TRLData[] = [
  { name: "TRL 1-3 (Early)", value: 68, color: "#ef4444" },
  { name: "TRL 4-6 (Mid)", value: 113, color: "#f59e0b" },
  { name: "TRL 7-9 (Mature)", value: 89, color: "#10b981" },
  { name: "TRL 9+ (Commercial)", value: 47, color: "#3b82f6" },
]

export const mockActivities: ActivityItem[] = [
  {
    id: "1",
    type: "Patent",
    description: "IBM files 47 new quantum error correction patents",
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    tech: "Quantum Computing"
  },
  {
    id: "2",
    type: "Funding",
    description: "Anthropic raises $4B at $18.4B valuation",
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    tech: "AI/ML"
  },
  {
    id: "3",
    type: "Publication",
    description: "Nature: Room-temp superconductor verified under pressure",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    tech: "Superconductors"
  },
  {
    id: "4",
    type: "Breakthrough",
    description: "First 1,000+ qubit fault-tolerant quantum computer announced",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    tech: "Quantum Computing"
  },
  {
    id: "5",
    type: "Funding",
    description: "Northvolt secures €1.2B for sodium-ion battery plant",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    tech: "Energy Storage"
  },
  {
    id: "6",
    type: "Patent",
    description: "Google patents photonic quantum chip architecture",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    tech: "Quantum Computing"
  },
]

export const mockSignals: Signal[] = [
  {
    id: "1",
    type: "patent",
    title: "IBM achieves 100x improvement in quantum error correction",
    tech: "Quantum Computing",
    importance: "high",
    date: "2 hours ago",
    value: "47 patents"
  },
  {
    id: "2",
    type: "funding",
    title: "Anthropic raises $4B led by Amazon & Google",
    tech: "AI/ML",
    importance: "high",
    date: "5 hours ago",
    value: "$4B"
  },
  {
    id: "3",
    type: "breakthrough",
    title: "Room-temperature ambient pressure superconductor confirmed",
    tech: "Superconductors",
    importance: "high",
    date: "1 day ago"
  },
  {
    id: "4",
    type: "publication",
    title: "Nature: CRISPR 2.0 enables 99.9% precision editing",
    tech: "Biotechnology",
    importance: "high",
    date: "2 days ago"
  },
]