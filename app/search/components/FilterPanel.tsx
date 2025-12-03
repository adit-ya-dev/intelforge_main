// app/search/components/FilterPanel.tsx
"use client"
import { useState } from "react"
import { ChevronDown, ChevronUp, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { SearchFilters } from "@/types/search"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface FilterPanelProps {
  filters: SearchFilters
  setFilters: (filters: SearchFilters) => void
  onApply: () => void
}

const domains = [
  "Quantum Computing",
  "Artificial Intelligence",
  "Biotechnology",
  "Energy Storage",
  "Advanced Materials",
  "Space Technology"
]

const trlLevels = [
  "TRL 1-3 (Basic Research)",
  "TRL 4-6 (Development)",
  "TRL 7-9 (Deployment)"
]

const countries = [
  "United States",
  "China",
  "Germany",
  "Japan",
  "United Kingdom",
  "South Korea"
]

const sourceTypes = [
  "Patent",
  "Research Paper",
  "Company",
  "Report",
  "News Article"
]

export default function FilterPanel({ filters, setFilters, onApply }: FilterPanelProps) {
  const [openSections, setOpenSections] = useState<string[]>([
    "domain",
    "trl",
    "sourceType"
  ])

  const toggleSection = (section: string) => {
    setOpenSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const activeFilterCount = [
    ...filters.domain,
    ...filters.trl,
    ...filters.country,
    ...filters.sourceType
  ].length

  const clearAllFilters = () => {
    setFilters({
      domain: [],
      trl: [],
      dateRange: { from: null, to: null },
      country: [],
      sourceType: [],
      organization: [],
      fundingRange: { min: null, max: null },
      confidence: [0, 100]
    })
  }

  return (
    <div className="w-80 border-r bg-muted/10 overflow-y-auto">
      <div className="p-4 border-b sticky top-0 bg-background z-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center gap-2">
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary">{activeFilterCount}</Badge>
            )}
          </h3>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-7 text-xs"
            >
              Clear all
            </Button>
          )}
        </div>
        <Button onClick={onApply} className="w-full">
          Apply Filters
        </Button>
      </div>

      <div className="p-4 space-y-4">
        {/* Domain Filter */}
        <Collapsible open={openSections.includes("domain")}>
          <CollapsibleTrigger
            onClick={() => toggleSection("domain")}
            className="flex items-center justify-between w-full"
          >
            <Label className="font-semibold">Domain</Label>
            {openSections.includes("domain") ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-2">
            {domains.map((domain) => (
              <div key={domain} className="flex items-center space-x-2">
                <Checkbox
                  id={`domain-${domain}`}
                  checked={filters.domain.includes(domain)}
                  onCheckedChange={(checked) => {
                    setFilters({
                      ...filters,
                      domain: checked
                        ? [...filters.domain, domain]
                        : filters.domain.filter(d => d !== domain)
                    })
                  }}
                />
                <label
                  htmlFor={`domain-${domain}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {domain}
                </label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* TRL Filter */}
        <Collapsible open={openSections.includes("trl")}>
          <CollapsibleTrigger
            onClick={() => toggleSection("trl")}
            className="flex items-center justify-between w-full"
          >
            <Label className="font-semibold">Technology Readiness</Label>
            {openSections.includes("trl") ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-2">
            {trlLevels.map((level) => (
              <div key={level} className="flex items-center space-x-2">
                <Checkbox
                  id={`trl-${level}`}
                  checked={filters.trl.includes(level)}
                  onCheckedChange={(checked) => {
                    setFilters({
                      ...filters,
                      trl: checked
                        ? [...filters.trl, level]
                        : filters.trl.filter(t => t !== level)
                    })
                  }}
                />
                <label
                  htmlFor={`trl-${level}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {level}
                </label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Country Filter */}
        <Collapsible open={openSections.includes("country")}>
          <CollapsibleTrigger
            onClick={() => toggleSection("country")}
            className="flex items-center justify-between w-full"
          >
            <Label className="font-semibold">Country</Label>
            {openSections.includes("country") ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-2">
            {countries.map((country) => (
              <div key={country} className="flex items-center space-x-2">
                <Checkbox
                  id={`country-${country}`}
                  checked={filters.country.includes(country)}
                  onCheckedChange={(checked) => {
                    setFilters({
                      ...filters,
                      country: checked
                        ? [...filters.country, country]
                        : filters.country.filter(c => c !== country)
                    })
                  }}
                />
                <label
                  htmlFor={`country-${country}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {country}
                </label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Source Type Filter */}
        <Collapsible open={openSections.includes("sourceType")}>
          <CollapsibleTrigger
            onClick={() => toggleSection("sourceType")}
            className="flex items-center justify-between w-full"
          >
            <Label className="font-semibold">Source Type</Label>
            {openSections.includes("sourceType") ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-2">
            {sourceTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`source-${type}`}
                  checked={filters.sourceType.includes(type)}
                  onCheckedChange={(checked) => {
                    setFilters({
                      ...filters,
                      sourceType: checked
                        ? [...filters.sourceType, type]
                        : filters.sourceType.filter(s => s !== type)
                    })
                  }}
                />
                <label
                  htmlFor={`source-${type}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {type}
                </label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Confidence Score Slider */}
        <Collapsible open={openSections.includes("confidence")}>
          <CollapsibleTrigger
            onClick={() => toggleSection("confidence")}
            className="flex items-center justify-between w-full"
          >
            <Label className="font-semibold">Confidence Score</Label>
            {openSections.includes("confidence") ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-2">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{filters.confidence[0]}%</span>
                <span>{filters.confidence[1]}%</span>
              </div>
              <Slider
                min={0}
                max={100}
                step={5}
                value={filters.confidence}
                onValueChange={(value) =>
                  setFilters({ ...filters, confidence: value as [number, number] })
                }
                className="w-full"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}