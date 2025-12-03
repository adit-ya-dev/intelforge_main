// app/dashboard/components/KPICards.tsx
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { KPIMetric } from "@/types/dashboard"

interface KPICardsProps {
  kpis: KPIMetric[]
}

export default function KPICards({ kpis }: KPICardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {kpi.label}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                {kpi.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                ) : kpi.trend === "down" ? (
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                ) : null}
                {kpi.changeLabel}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}