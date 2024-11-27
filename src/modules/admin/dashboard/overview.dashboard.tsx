import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Book, Image, TrendingDown, TrendingUp, Users, Video } from "lucide-react"
import { useState } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { StatCardProps } from "./types"

const visitorData = [
  { month: "Jan", physical: 1200, virtual: 3500 },
  { month: "Feb", physical: 1400, virtual: 3800 },
  { month: "Mar", physical: 1600, virtual: 4200 },
  { month: "Apr", physical: 1800, virtual: 4600 },
  { month: "May", physical: 2000, virtual: 5000 },
  { month: "Jun", physical: 2200, virtual: 5400 },
]

const contentEngagementData = [
  { type: "Articles", views: 12000, likes: 3500, shares: 1800 },
  { type: "Photos", views: 18000, likes: 5200, shares: 2400 },
  { type: "Videos", views: 8000, likes: 2800, shares: 1600 },
  { type: "Virtual Tours", views: 6000, likes: 1800, shares: 900 },
]

const exhibitPopularityData = [
  { name: "Ancient Artifacts", value: 30 },
  { name: "Modern Art", value: 25 },
  { name: "Natural History", value: 20 },
  { name: "Cultural Heritage", value: 15 },
  { name: "Science & Tech", value: 10 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

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

export default function MuseumCMSDashboard() {
  const [timeRange, setTimeRange] = useState("6m")

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 bg-background">
      <div className="flex justify-between items-center">
        <Select defaultValue={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1m">Last Month</SelectItem>
            <SelectItem value="3m">Last 3 Months</SelectItem>
            <SelectItem value="6m">Last 6 Months</SelectItem>
            <SelectItem value="1y">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Users className="h-4 w-4" />} title="Total Visitors" value="24,500" trend={8.2} />
        <StatCard icon={<Book className="h-4 w-4" />} title="Articles Published" value="142" trend={5.7} />
        <StatCard icon={<Image className="h-4 w-4" />} title="Photos Uploaded" value="1,890" trend={12.3} />
        <StatCard icon={<Video className="h-4 w-4" />} title="Videos Created" value="68" trend={-2.5} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>Visitor Statistics</CardTitle>
            <CardDescription>Physical vs Virtual Visitors</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={visitorChartConfig} className="h-[300px]">
              <AreaChart data={visitorData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="virtual" stackId="1" stroke="var(--color-virtual)" fill="var(--color-virtual)" />
                <Area type="monotone" dataKey="physical" stackId="1" stroke="var(--color-physical)" fill="var(--color-physical)" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>Content Engagement</CardTitle>
            <CardDescription>Views, Likes, and Shares by Content Type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={contentEngagementData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <ChartTooltip />
                <Bar dataKey="views" fill="#8884d8" />
                <Bar dataKey="likes" fill="#82ca9d" />
                <Bar dataKey="shares" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="col-span-3 md:col-span-1">
          <CardHeader>
            <CardTitle>Exhibit Popularity</CardTitle>
            <CardDescription>Distribution of visitor interest</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={exhibitPopularityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {exhibitPopularityData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
          <CardFooter>
            <div className="w-full space-y-1">
              {exhibitPopularityData.map((item, index) => (
                <div key={item.name} className="flex items-center">
                  <div className="w-2 h-2 mr-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <div className="flex-1 text-sm">{item.name}</div>
                  <div className="text-sm font-medium">{item.value}%</div>
                </div>
              ))}
            </div>
          </CardFooter>
        </Card>

        <Card className="col-span-3 md:col-span-2">
          <CardHeader>
            <CardTitle>Content Creation Progress</CardTitle>
            <CardDescription>Track the progress of ongoing content creation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ProgressItem label="New Virtual Tour" progress={75} />
              <ProgressItem label="Historical Article Series" progress={40} />
              <ProgressItem label="Interactive Exhibit Map" progress={90} />
              <ProgressItem label="Educational Video Series" progress={60} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ icon, title, value, trend = 0 }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${trend >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
          {trend >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
          {Math.abs(trend)}% from last {}
        </p>
      </CardContent>
    </Card>
  )
}

function ProgressItem({ label, progress }: { label: string, progress: number}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} className="w-full" />
    </div>
  )
}

