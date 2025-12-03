// app/search/components/ResultsList.tsx
"use client"
import { useEffect, useRef } from "react"
import { ArrowUpDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import ResultCard from "./ResultCard"
import { SearchResult } from "@/types/search"
import { Badge } from "@/components/ui/badge"

interface ResultsListProps {
  results: SearchResult[]
  sortBy: string
  setSortBy: (sort: string) => void
  onSelectResult: (result: SearchResult) => void
  isLoading: boolean
  onLoadMore: () => void
  hasMore: boolean
  searchMode: "semantic" | "keyword"
}

export default function ResultsList({
  results,
  sortBy,
  setSortBy,
  onSelectResult,
  isLoading,
  onLoadMore,
  hasMore,
  searchMode
}: ResultsListProps) {
  const observerTarget = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore()
        }
      },
      { threshold: 1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [hasMore, isLoading, onLoadMore])

  return (
    <div className="flex flex-col h-full">
      {/* Results Header */}
      <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-background z-10">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold">
            {results.length} Results
          </h2>
          {searchMode === "semantic" && (
            <Badge variant="secondary" className="gap-1">
              AI-Powered
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="date">Date (Newest)</SelectItem>
              <SelectItem value="trl">Highest TRL</SelectItem>
              <SelectItem value="citations">Most Cited</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading && results.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg font-medium">No results found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Try adjusting your search query or filters
            </p>
          </div>
        ) : (
          <>
            {results.map((result) => (
              <ResultCard
                key={result.id}
                result={result}
                onClick={() => onSelectResult(result)}
              />
            ))}
            
            {/* Infinite Scroll Trigger */}
            <div ref={observerTarget} className="h-20 flex items-center justify-center">
              {isLoading && (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              )}
              {!hasMore && results.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  No more results
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}