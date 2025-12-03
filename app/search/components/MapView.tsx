// app/search/components/MapView.tsx
"use client"

import { useState, useEffect } from "react"
import { MapPin, ZoomIn, ZoomOut, Globe } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SearchResult } from "@/types/search"

interface MapViewProps {
  results: SearchResult[]
}

// Mock country coordinates
const countryCoordinates: Record<string, { lat: number; lng: number }> = {
  "United States": { lat: 37.0902, lng: -95.7129 },
  "China": { lat: 35.8617, lng: 104.1954 },
  "Germany": { lat: 51.1657, lng: 10.4515 },
  "Japan": { lat: 36.2048, lng: 138.2529 },
  "United Kingdom": { lat: 55.3781, lng: -3.4360 },
  "South Korea": { lat: 35.9078, lng: 127.7669 },
}

export default function MapView({ results }: MapViewProps) {
  const [zoom, setZoom] = useState(2)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

  // Group results by country
  const resultsByCountry = results.reduce((acc, result) => {
    const country = result.country || "Unknown"
    if (!acc[country]) {
      acc[country] = []
    }
    acc[country].push(result)
    return acc
  }, {} as Record<string, SearchResult[]>)

  // Calculate statistics
  const countryStats = Object.entries(resultsByCountry).map(([country, items]) => ({
    country,
    count: items.length,
    patents: items.filter(r => r.type === "Patent").length,
    papers: items.filter(r => r.type === "Paper").length,
    companies: items.filter(r => r.type === "Company").length,
    avgTRL: items.filter(r => r.trl).reduce((sum, r) => sum + (r.trl || 0), 0) / items.filter(r => r.trl).length || 0,
    coordinates: countryCoordinates[country]
  })).sort((a, b) => b.count - a.count)

  // Set default selected country to the one with most results
  useEffect(() => {
    if (countryStats.length > 0 && !selectedCountry) {
      setSelectedCountry(countryStats[0].country)
    }
  }, [countryStats, selectedCountry])

  // Show empty state if no results
  if (results.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Globe className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Geographic Data</h3>
          <p className="text-sm text-muted-foreground">
            Search for technologies to see their global distribution
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex">
      {/* Map Placeholder */}
      <div className="flex-1 relative bg-muted/20 flex items-center justify-center">
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setZoom(z => Math.min(z + 1, 10))}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setZoom(z => Math.max(z - 1, 1))}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <div className="px-3 py-2 bg-background border rounded-md text-xs font-medium">
            Zoom: {zoom}x
          </div>
        </div>

        {/* Map Header */}
        <div className="absolute top-4 left-4 z-10">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Global Distribution</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {results.length} results across {countryStats.length} countries
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Map visualization */}
        <div className="relative w-full h-full flex items-center justify-center p-8">
          <div className="grid grid-cols-3 gap-4 max-w-5xl w-full">
            {countryStats.slice(0, 9).map((stat) => (
              <Card
                key={stat.country}
                className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
                  selectedCountry === stat.country 
                    ? 'ring-2 ring-primary shadow-lg scale-105' 
                    : ''
                }`}
                onClick={() => setSelectedCountry(stat.country)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className={`h-4 w-4 ${
                      selectedCountry === stat.country 
                        ? 'text-primary' 
                        : 'text-muted-foreground'
                    }`} />
                    <h3 className="font-semibold text-sm">{stat.country}</h3>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total:</span>
                      <Badge variant="secondary" className="font-bold">
                        {stat.count}
                      </Badge>
                    </div>
                    {stat.patents > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Patents:</span>
                        <span className="font-medium">{stat.patents}</span>
                      </div>
                    )}
                    {stat.papers > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Papers:</span>
                        <span className="font-medium">{stat.papers}</span>
                      </div>
                    )}
                    {stat.companies > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Companies:</span>
                        <span className="font-medium">{stat.companies}</span>
                      </div>
                    )}
                    {stat.avgTRL > 0 && (
                      <div className="flex justify-between text-xs items-center">
                        <span className="text-muted-foreground">Avg TRL:</span>
                        <Badge 
                          variant={stat.avgTRL >= 7 ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {stat.avgTRL.toFixed(1)}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Show message if there are more countries */}
            {countryStats.length > 9 && (
              <Card className="col-span-3 bg-muted/50">
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    + {countryStats.length - 9} more countries with results
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Country Details Sidebar */}
      {selectedCountry && resultsByCountry[selectedCountry] && (
        <div className="w-96 border-l overflow-y-auto bg-background">
          <div className="p-4 border-b sticky top-0 bg-background z-10">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                {selectedCountry}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCountry(null)}
              >
                Close
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {resultsByCountry[selectedCountry].length} results in this region
            </p>
            
            {/* Quick Stats */}
            <div className="flex gap-2 mt-3">
              {countryStats.find(s => s.country === selectedCountry)?.patents > 0 && (
                <Badge variant="outline" className="text-xs">
                  {countryStats.find(s => s.country === selectedCountry)?.patents} Patents
                </Badge>
              )}
              {countryStats.find(s => s.country === selectedCountry)?.papers > 0 && (
                <Badge variant="outline" className="text-xs">
                  {countryStats.find(s => s.country === selectedCountry)?.papers} Papers
                </Badge>
              )}
              {countryStats.find(s => s.country === selectedCountry)?.companies > 0 && (
                <Badge variant="outline" className="text-xs">
                  {countryStats.find(s => s.country === selectedCountry)?.companies} Companies
                </Badge>
              )}
            </div>
          </div>
          
          <div className="p-4 space-y-3">
            {resultsByCountry[selectedCountry].slice(0, 20).map((result) => (
              <Card 
                key={result.id} 
                className="hover:shadow-md transition-all cursor-pointer border-l-4"
                style={{ 
                  borderLeftColor: result.trl && result.trl >= 7 ? '#10b981' : '#e5e7eb' 
                }}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5 text-xs">
                      {result.type}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2 mb-1">
                        {result.title}
                      </h4>
                      {result.organization && (
                        <p className="text-xs text-muted-foreground line-clamp-1 mb-1">
                          {result.organization}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {result.date && (
                          <span>{new Date(result.date).getFullYear()}</span>
                        )}
                        {result.trl && (
                          <>
                            <span>•</span>
                            <Badge 
                              variant={result.trl >= 7 ? "default" : "secondary"}
                              className="text-xs"
                            >
                              TRL {result.trl}
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {resultsByCountry[selectedCountry].length > 20 && (
              <Card className="bg-muted/50">
                <CardContent className="p-3 text-center">
                  <p className="text-sm text-muted-foreground">
                    + {resultsByCountry[selectedCountry].length - 20} more results
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}