// app/search/components/ResultCard.tsx
import { FileText, Building2, FlaskConical, Newspaper, TrendingUp, MapPin, Calendar, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SearchResult } from "@/types/search"

interface ResultCardProps {
  result: SearchResult
  onClick: () => void
}

const getTypeIcon = (type: SearchResult["type"]) => {
  switch (type) {
    case "Patent":
      return FileText
    case "Paper":
      return FlaskConical
    case "Company":
      return Building2
    case "Report":
      return FileText
    case "News":
      return Newspaper
    default:
      return FileText
  }
}

const getTypeBadgeVariant = (type: SearchResult["type"]) => {
  switch (type) {
    case "Patent":
      return "default"
    case "Paper":
      return "secondary"
    case "Company":
      return "outline"
    case "Report":
      return "destructive"
    case "News":
      return "default"
    default:
      return "default"
  }
}

const getTRLColor = (trl: number) => {
  if (trl >= 7) return "text-green-600"
  if (trl >= 4) return "text-yellow-600"
  return "text-red-600"
}

export default function ResultCard({ result, onClick }: ResultCardProps) {
  const TypeIcon = getTypeIcon(result.type)

  return (
    <Card 
      className="hover:shadow-md transition-all cursor-pointer border-l-4"
      style={{ borderLeftColor: result.relevanceScore > 0.8 ? '#3b82f6' : '#e5e7eb' }}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="p-2 rounded-lg bg-muted flex-shrink-0">
            <TypeIcon className="h-5 w-5 text-muted-foreground" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base line-clamp-2 mb-1">
                  {result.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {result.snippet}
                </p>
              </div>
              {result.relevanceScore && (
                <Badge variant="secondary" className="flex-shrink-0">
                  {Math.round(result.relevanceScore * 100)}% match
                </Badge>
              )}
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-2">
              <Badge variant={getTypeBadgeVariant(result.type as any)}>
                {result.type}
              </Badge>
              
              {result.date && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(result.date).toLocaleDateString()}
                </span>
              )}
              
              {result.country && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {result.country}
                </span>
              )}
              
              {result.trl && (
                <span className={`flex items-center gap-1 font-medium ${getTRLColor(result.trl)}`}>
                  <TrendingUp className="h-3 w-3" />
                  TRL {result.trl}
                </span>
              )}

              {result.citations && (
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {result.citations} citations
                </span>
              )}
            </div>

            {/* Tags */}
            {result.tags && result.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {result.tags.slice(0, 4).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {result.tags.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{result.tags.length - 4} more
                  </Badge>
                )}
              </div>
            )}

            {/* Organization */}
            {result.organization && (
              <div className="mt-2 text-sm">
                <span className="text-muted-foreground">By:</span>{" "}
                <span className="font-medium">{result.organization}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}