import { Suspense } from 'react'
import { getDashboardStats } from '@/lib/actions/application.actions'
import { getRecentActivity } from '@/lib/actions/activity.actions'
import { StatCard } from '@/components/dashboard/stat-card'
import { ApplicationsChart } from '@/components/dashboard/applications-chart'
import { FunnelChart } from '@/components/dashboard/funnel-chart'
import { RecentActivityFeed } from '@/components/dashboard/recent-activity-feed'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import DashboardLoading from './loading'

async function DashboardContent() {
  const [statsResult, activityResult] = await Promise.all([
    getDashboardStats(),
    getRecentActivity(10),
  ])

  const stats = statsResult.data
  const activities = activityResult.data ?? []

  if (!stats) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        Could not load dashboard data. Please try refreshing.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Your job search at a glance</p>
      </div>

      {/* Row 1: 4 stat cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Applications" value={stats.totalApplications} />
        <StatCard label="Active Applications" value={stats.activeApplications} />
        <StatCard
          label="Response Rate"
          value={`${stats.responseRate}%`}
          valueColor={stats.responseRate > 20 ? '#22c55e' : undefined}
        />
        <StatCard
          label="Avg Match Score"
          value={`${stats.avgMatchScore}%`}
          valueColor={stats.avgMatchScore >= 70 ? '#22c55e' : stats.avgMatchScore >= 50 ? '#eab308' : undefined}
        />
      </div>

      {/* Row 2: 3 stat cards */}
      <div className="grid gap-4 grid-cols-3">
        <StatCard label="Interview Rate" value={`${stats.interviewRate}%`} />
        <StatCard label="Offer Rate" value={`${stats.offerRate}%`} />
        <StatCard label="Rejection Rate" value={`${stats.rejectionRate}%`} />
      </div>

      {/* Row 3: Charts */}
      <div className="grid gap-4 grid-cols-5">
        <Card className="col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Applications per Week</CardTitle>
          </CardHeader>
          <CardContent>
            <ApplicationsChart data={stats.weeklyData} />
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Funnel Conversion</CardTitle>
          </CardHeader>
          <CardContent>
            <FunnelChart data={stats.funnelData} />
          </CardContent>
        </Card>
      </div>

      {/* Row 4: Activity + Follow-ups */}
      <div className="grid gap-4 grid-cols-5">
        <Card className="col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivityFeed activities={activities} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Follow-Ups</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-8">
              Follow-ups you generate will appear here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  )
}
