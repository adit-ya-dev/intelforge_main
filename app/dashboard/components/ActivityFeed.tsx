// components/dashboard/ActivityFeed.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockActivities } from "@/lib/mock-data"

export default function ActivityFeed() {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Activity</CardTitle>
          <Button variant="ghost" size="sm">View All</Button>
        </div>
        <CardDescription>Latest technology events</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {mockActivities.map((activity) => (
            <div key={activity.id} className="flex gap-3 text-sm">
              <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium">{activity.description}</p>
                </div>

                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
                  <Badge variant="outline" className="text-xs">{activity.type}</Badge>
                  <span>{activity.tech}</span>
                  <span>•</span>
                  <span>{activity.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
