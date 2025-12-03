// app/search/components/SearchHeader.tsx
"use client"
import { Map, List, Save, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SearchHeaderProps {
  viewMode: "list" | "map"
  setViewMode: (mode: "list" | "map") => void
  onSaveQuery: () => void
}

export default function SearchHeader({ viewMode, setViewMode, onSaveQuery }: SearchHeaderProps) {
  return (
    <div className="border-b p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tech Explorer</h1>
          <p className="text-muted-foreground">
            Discover technologies, patents, papers, and organizations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "list" | "map")}>
            <TabsList>
              <TabsTrigger value="list" className="gap-2">
                <List className="h-4 w-4" />
                List
              </TabsTrigger>
              <TabsTrigger value="map" className="gap-2">
                <Map className="h-4 w-4" />
                Map
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm" onClick={onSaveQuery}>
            <Save className="h-4 w-4 mr-2" />
            Create Alert
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
    </div>
  )
}