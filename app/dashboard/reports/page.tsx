'use client'

const reports = [
  {
    name: '01-Ji-Ao_Verra_Listing_Representation',
    type: 'Report',
    status: 'review',
    project: 'Solar Power Plant Project',
    modified: '06.07.2024',
  },
  {
    name: 'VCU Conversion Deed v4.2',
    type: 'Report',
    status: 'draft',
    project: 'Solar Power Plant Project',
    modified: '06.07.2024',
  },
  {
    name: 'ERS MP 01062020 31122020',
    type: 'Report',
    status: 'approved',
    project: 'Solar Power Plant Project',
    modified: '06.07.2024',
  },
]

export default function ReportsPage() {
  return (
    <>
      <div className="hero-header">
        <h1>Reports</h1>
      </div>

      <div className="dashboard-content space-y-4">
        <div className="table-shell">
          <div className="table-header">
            <div />
            <div>Name</div>
            <div>Type</div>
            <div>Status</div>
            <div>Project</div>
            <div>Modified</div>
          </div>

          {reports.map((r, i) => (
            <div key={i} className="table-row">
              <input type="checkbox" />

              <div className="font-medium">{r.name}</div>
              <div>{r.type}</div>

              <div
                className={`status-pill ${
                  r.status === 'draft'
                    ? 'status-draft'
                    : r.status === 'review'
                    ? 'status-review'
                    : 'status-approved'
                }`}
              >
                {r.status === 'review'
                  ? 'In review'
                  : r.status.charAt(0).toUpperCase() +
                    r.status.slice(1)}
              </div>

              <div className="text-slate-500">{r.project}</div>
              <div className="text-slate-500">{r.modified}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
