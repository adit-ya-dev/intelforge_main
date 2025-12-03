// app/search/components/PreviewDrawer.tsx
"use client"
import { X, ExternalLink, Plus, Search, Share2, Download, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { SearchResult } from "@/types/search"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

interface PreviewDrawerProps {
  result: SearchResult | null
  onClose: () => void
}

export default function PreviewDrawer({ result, onClose }: PreviewDrawerProps) {
  if (!result) return null

  return (
    <Sheet open={!!result} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <SheetTitle className="text-xl mb-2">{result.title}</SheetTitle>
              <div className="flex flex-wrap gap-2">
                <Badge>{result.type}</Badge>
                {result.trl && (
                  <Badge variant="secondary">TRL {result.trl}</Badge>
                )}
                {result.country && (
                  <Badge variant="outline">{result.country}</Badge>
                )}
              </div>
            </div>
          </div>
        </SheetHeader>

        <Separator />

        {/* Action Buttons */}
        <div className="px-6 py-3 flex gap-2 border-b">
          <Button size="sm" className="flex-1">
            <Plus className="h-4 w-4 mr-2" />
            Add to Watch
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Search className="h-4 w-4 mr-2" />
            Find Similar
          </Button>
          <Button size="sm" variant="outline">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-6 py-4">
            {/* Abstract/Description */}
            <div>
              <h3 className="font-semibold mb-2">Abstract</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {result.abstract || result.snippet}
              </p>
            </div>

            {/* Metadata */}
            <div>
              <h3 className="font-semibold mb-3">Details</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {result.organization && (
                  <div>
                    <span className="text-muted-foreground">Organization:</span>
                    <p className="font-medium">{result.organization}</p>
                  </div>
                )}
                {result.date && (
                  <div>
                    <span className="text-muted-foreground">Date:</span>
                    <p className="font-medium">
                      {new Date(result.date).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {result.country && (
                  <div>
                    <span className="text-muted-foreground">Country:</span>
                    <p className="font-medium">{result.country}</p>
                  </div>
                )}
                {result.citations && (
                  <div>
                    <span className="text-muted-foreground">Citations:</span>
                    <p className="font-medium">{result.citations}</p>
                  </div>
                )}
                {result.trl && (
                  <div>
                    <span className="text-muted-foreground">TRL Level:</span>
                    <p className="font-medium">TRL {result.trl}</p>
                  </div>
                )}
                {result.fundingAmount && (
                  <div>
                    <span className="text-muted-foreground">Funding:</span>
                    <p className="font-medium">${result.fundingAmount}M</p>
                  </div>
                )}
              </div>
            </div>

            {/* Key Entities */}
            {result.entities && result.entities.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Key Entities</h3>
                <div className="flex flex-wrap gap-2">
                  {result.entities.map((entity) => (
                    <Badge key={entity} variant="secondary">
                      {entity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {result.tags && result.tags.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {result.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Explainability */}
            {result.matchedChunks && result.matchedChunks.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Why This Matched
                </h3>
                <div className="space-y-2">
                  {result.matchedChunks.map((chunk, idx) => (
                    <div key={idx} className="p-3 bg-muted/50 rounded-lg text-sm">
                      <p className="text-muted-foreground italic">"{chunk}"</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Relevance: {Math.round(result.relevanceScore * 100)}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Source Link */}
            {result.sourceUrl && (
              <div>
                <Button variant="outline" className="w-full" asChild>
                  <a href={result.sourceUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Original Source
                  </a>
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}