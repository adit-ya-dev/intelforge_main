// components/dashboard/charts/PatentChart.tsx
"use client"
import { Maximize2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"
import { mockPatentData } from "@/lib/mock-data"

interface PatentChartProps {
  timeRange: string
}

export default function PatentChart({ timeRange }: PatentChartProps) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Patent Filings & Citations</CardTitle>
          <Button variant="ghost" size="sm">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>Weekly trends over the last {timeRange}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={mockPatentData}>
            <defs>
              <linearGradient id="colorFilings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorCitations" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="date" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="filings" 
              stroke="#3b82f6" 
              fillOpacity={1} 
              fill="url(#colorFilings)" 
              name="Patent Filings"
            />
            <Area 
              type="monotone" 
              dataKey="citations" 
              stroke="#10b981" 
              fillOpacity={1} 
              fill="url(#colorCitations)" 
              name="Citations"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
