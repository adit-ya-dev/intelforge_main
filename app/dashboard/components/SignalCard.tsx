// components/dashboard/SignalCard.tsx
import { FileText, DollarSign, Sparkles, Activity } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Signal } from "@/types/dashboard"

interface SignalCardProps {
  signal: Signal
}

const getSignalIcon = (type: Signal["type"]) => {
  switch (type) {
    case "patent": return FileText
    case "funding": return DollarSign
    case "publication": return FileText
    case "breakthrough": return Sparkles
    default: return Activity
  }
}

const getImportanceBadge = (importance: Signal["importance"]) => {
  const variants = {
    high: "destructive",
    medium: "default",
    low: "secondary"
  }
  return variants[importance] as any
}

export default function SignalCard({ signal }: SignalCardProps) {
  const SignalIcon = getSignalIcon(signal.type)

  return (
    <Card className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-2">
          <SignalIcon className="h-4 w-4 text-muted-foreground" />
          <Badge variant={getImportanceBadge(signal.importance)} className="text-xs">
            {signal.importance}
          </Badge>
        </div>
        <p className="text-sm font-medium line-clamp-2 mb-2">{signal.title}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="truncate">{signal.tech}</span>
          <span>{signal.date}</span>
        </div>
        {signal.value && (
          <Badge variant="outline" className="mt-2">{signal.value}</Badge>
        )}
      </CardContent>
    </Card>
  )
}