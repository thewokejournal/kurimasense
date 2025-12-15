'use client'

export default function DashboardPage() {
  return (
    <>
      <div className="hero-header">
        <h1>Dashboard</h1>
      </div>

      <div className="dashboard-content space-y-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="surface-card">
            <div className="text-sm text-slate-500">Fields Monitored</div>
            <div className="text-2xl font-semibold">12</div>
          </div>

          <div className="surface-card">
            <div className="text-sm text-slate-500">Avg Crop Health</div>
            <div className="text-2xl font-semibold">82%</div>
          </div>

          <div className="surface-card">
            <div className="text-sm text-slate-500">Active Alerts</div>
            <div className="text-2xl font-semibold">2</div>
          </div>
        </div>

        <div className="surface-card">
          <div className="text-sm text-slate-500 mb-2">Latest Insight</div>
          <p>
            NDVI decline detected in Field 3 during flowering stage.
            Possible moisture stress.
          </p>
        </div>
      </div>
    </>
  )
}
