// app/dashboard/components/SearchBar.tsx
import { Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface SearchBarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

const recentSearches = [
  "Quantum Computing",
  "CRISPR",
  "Solid-State Batteries"
]

export default function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search technologies, patents, organizations... (semantic & keyword)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>
        {searchQuery && (
          <div className="mt-2 flex gap-2">
            {recentSearches.map((search) => (
              <Badge key={search} variant="secondary">
                Recent: {search}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}