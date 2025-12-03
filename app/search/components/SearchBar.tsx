// app/search/components/SearchBar.tsx
"use client"
import { Search, Loader2, Sparkles, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SearchBarProps {
  query: string
  setQuery: (query: string) => void
  searchMode: "semantic" | "keyword"
  setSearchMode: (mode: "semantic" | "keyword") => void
  onSearch: (query: string) => void
  isLoading: boolean
}

const recentSearches = [
  "Quantum computing breakthroughs",
  "CRISPR gene editing patents",
  "Solid-state battery technology"
]

export default function SearchBar({
  query,
  setQuery,
  searchMode,
  setSearchMode,
  onSearch,
  isLoading
}: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query)
    }
  }

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search technologies, patents, papers, organizations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 h-12 text-base pr-32"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            {searchMode === "semantic" && (
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="h-3 w-3" />
                AI Search
              </Badge>
            )}
            {searchMode === "keyword" && (
              <Badge variant="outline">
                Exact Match
              </Badge>
            )}
          </div>
        </div>
        <Select value={searchMode} onValueChange={(v) => setSearchMode(v as any)}>
          <SelectTrigger className="w-40 h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semantic">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Semantic
              </div>
            </SelectItem>
            <SelectItem value="keyword">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Keyword
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" size="lg" disabled={isLoading || !query.trim()}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Search
            </>
          )}
        </Button>
      </form>

      {/* Recent Searches */}
      {!query && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Recent:</span>
          {recentSearches.map((search) => (
            <Button
              key={search}
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery(search)
                onSearch(search)
              }}
              className="h-7"
            >
              {search}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}