import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { ArrowDownRight, ArrowUpRight, Calendar, Clock, Eye, Share2, ThumbsUp } from "lucide-react"
import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { StatCardProps } from "./types"

const visitorData = [
  { date: '2023-07-01', physical: 150, virtual: 300 },
  { date: '2023-07-02', physical: 200, virtual: 280 },
  { date: '2023-07-03', physical: 180, virtual: 350 },
  { date: '2023-07-04', physical: 220, virtual: 400 },
  { date: '2023-07-05', physical: 250, virtual: 320 },
  { date: '2023-07-06', physical: 180, virtual: 390 },
  { date: '2023-07-07', physical: 190, virtual: 370 },
]

const contentEngagementData = [
  { type: 'Article', views: 1200, likes: 350, shares: 180 },
  { type: 'Photo', views: 1800, likes: 520, shares: 240 },
  { type: 'Video', views: 800, likes: 280, shares: 160 },
  { type: 'Virtual Tour', views: 600, likes: 180, shares: 90 },
]

const topContentData = [
  { title: "Ancient Philippines: A Journey Through Time", type: "Article", views: 3500, trend: 12.5 },
  { title: "Virtual Tour: Intramuros", type: "Virtual Tour", views: 2800, trend: 8.3 },
  { title: "Filipino Art Through the Centuries", type: "Photo Gallery", views: 2200, trend: -3.7 },
  { title: "The Making of Filipino Cuisine", type: "Video", views: 1900, trend: 15.2 },
  { title: "Indigenous Textiles of the Philippines", type: "Article", views: 1700, trend: 5.8 },
]

const visitorChartConfig = {
  physical: {
    label: "Physical Visitors",
    color: "hsl(var(--chart-1))",
  },
  virtual: {
    label: "Virtual Visitors",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export default function DetailedDashboard() {
  const [activeTab, setActiveTab] = useState("visitors")

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Detailed Analytics</CardTitle>
        <CardDescription>In-depth analysis of museum engagement and content performance</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="visitors">Visitor Insights</TabsTrigger>
            <TabsTrigger value="content">Content Performance</TabsTrigger>
            <TabsTrigger value="top-content">Top Content</TabsTrigger>
          </TabsList>
          <TabsContent value="visitors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Daily Visitor Trends</CardTitle>
                <CardDescription>Physical vs Virtual visitors over the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={visitorChartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={visitorData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line type="monotone" dataKey="physical" stroke="var(--color-physical)" />
                      <Line type="monotone" dataKey="virtual" stroke="var(--color-virtual)" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            <div className="grid gap-4 md:grid-cols-2">
              <StatCard
                title="Average Time Spent"
                value="45 minutes"
                icon={<Clock className="h-4 w-4" />}
                description="Average duration of museum visits"
              />
              <StatCard
                title="Peak Hours"
                value="2 PM - 4 PM"
                icon={<Calendar className="h-4 w-4" />}
                description="Busiest time for both physical and virtual visits"
              />
            </div>
          </TabsContent>
          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Content Engagement Metrics</CardTitle>
                <CardDescription>Views, likes, and shares by content type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={contentEngagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="views" fill="#8884d8" />
                    <Bar dataKey="likes" fill="#82ca9d" />
                    <Bar dataKey="shares" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <div className="grid gap-4 md:grid-cols-3">
              <StatCard
                title="Total Views"
                value="4,400"
                icon={<Eye className="h-4 w-4" />}
                description="Across all content types"
              />
              <StatCard
                title="Total Likes"
                value="1,330"
                icon={<ThumbsUp className="h-4 w-4" />}
                description="Engagement metric"
              />
              <StatCard
                title="Total Shares"
                value="670"
                icon={<Share2 className="h-4 w-4" />}
                description="Content distribution"
              />
            </div>
          </TabsContent>
          <TabsContent value="top-content">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Content</CardTitle>
                <CardDescription>Most viewed content items in the past month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {topContentData.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.type}</p>
                      </div>
                      <div className="ml-auto font-medium">{item.views.toLocaleString()} views</div>
                      <div className={cn(
                        "ml-2 text-sm",
                        item.trend > 0 ? "text-green-500" : "text-red-500"
                      )}>
                        {item.trend > 0 ? (
                          <ArrowUpRight className="h-4 w-4 inline" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 inline" />
                        )}
                        {Math.abs(item.trend)}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
