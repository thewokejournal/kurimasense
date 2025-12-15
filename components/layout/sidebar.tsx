import Link from 'next/link'
import { FileText } from 'lucide-react'

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Upstream</div>

      <nav className="sidebar-nav">
        <button className="nav-item active" />
        <button className="nav-item" />
        <button className="nav-item" />
        <button className="nav-item" />

        <Link href="/dashboard/reports">
          <div className="sidebar-icon">
            <FileText size={20} />
          </div>
        </Link>
      </nav>
    </aside>
  )
}
