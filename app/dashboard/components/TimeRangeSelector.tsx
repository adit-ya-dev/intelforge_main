// components/dashboard/TimeRangeSelector.tsx
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TimeRangeSelectorProps {
  timeRange: string
  setTimeRange: (range: string) => void
}

export default function TimeRangeSelector({ timeRange, setTimeRange }: TimeRangeSelectorProps) {
  return (
    <Tabs value={timeRange} onValueChange={setTimeRange}>
      <TabsList>
        <TabsTrigger value="7d">7 Days</TabsTrigger>
        <TabsTrigger value="30d">30 Days</TabsTrigger>
        <TabsTrigger value="1y">1 Year</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}