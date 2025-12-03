// app/search/page.tsx
"use client"

import { useState, useEffect } from "react"
import SearchHeader from "./components/SearchHeader"
import SearchBar from "./components/SearchBar"
import FilterPanel from "./components/FilterPanel"
import ResultsList from "./components/ResultsList"
import PreviewDrawer from "./components/PreviewDrawer"
import MapView from "./components/MapView"
import { SearchResult, SearchFilters } from "@/types/search"
import { mockSearchResults } from "@/lib/search-mock-data"

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [searchMode, setSearchMode] = useState<"semantic" | "keyword">("semantic")
  const [filters, setFilters] = useState<SearchFilters>({
    domain: [],
    trl: [],
    dateRange: { from: null, to: null },
    country: [],
    sourceType: [],
    organization: [],
    fundingRange: { min: null, max: null },
    confidence: [0, 100]
  })
  const [sortBy, setSortBy] = useState<"relevance" | "date" | "trl" | "citations">("relevance")
  const [viewMode, setViewMode] = useState<"list" | "map">("list")
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const handleSearch = async (searchQuery: string) => {
    setIsLoading(true)
    setPage(1)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Mock results - replace with actual API call
    setResults(mockSearchResults)
    setIsLoading(false)
  }

  const handleLoadMore = async () => {
    if (!hasMore || isLoading) return
    
    setIsLoading(true)
    setPage(prev => prev + 1)
    
    // Simulate API call for next page
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock pagination
    setResults(prev => [...prev, ...mockSearchResults.slice(0, 3)])
    setIsLoading(false)
  }

  const handleSaveQuery = () => {
    // Save current query as alert
    console.log("Saving query:", query, filters)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <SearchHeader 
          viewMode={viewMode}
          setViewMode={setViewMode}
          onSaveQuery={handleSaveQuery}
        />

        {/* Search Bar */}
        <div className="border-b p-4">
          <SearchBar
            query={query}
            setQuery={setQuery}
            searchMode={searchMode}
            setSearchMode={setSearchMode}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Filter Panel */}
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            onApply={() => handleSearch(query)}
          />

          {/* Results Area */}
          <div className="flex-1 overflow-auto">
            {viewMode === "list" ? (
              <ResultsList
                results={results}
                sortBy={sortBy}
                setSortBy={setSortBy}
                onSelectResult={setSelectedResult}
                isLoading={isLoading}
                onLoadMore={handleLoadMore}
                hasMore={hasMore}
                searchMode={searchMode}
              />
            ) : (
              <MapView results={results} />
            )}
          </div>
        </div>
      </div>

      {/* Preview Drawer */}
      <PreviewDrawer
        result={selectedResult}
        onClose={() => setSelectedResult(null)}
      />
    </div>
  )
}