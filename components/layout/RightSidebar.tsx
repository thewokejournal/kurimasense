'use client'

import { Bug, User as UserIcon, Radio, Clock } from 'lucide-react'

const notifications = [
  {
    id: 1,
    message: 'You fixed a bug.',
    icon: Bug,
    time: 'Just now',
  },
  {
    id: 2,
    message: 'New user registered.',
    icon: UserIcon,
    time: '59 minutes ago',
  },
  {
    id: 3,
    message: 'You fixed a bug.',
    icon: Bug,
    time: '12 hours ago',
  },
  {
    id: 4,
    message: 'Andi Lane subscribed to you.',
    icon: Radio,
    time: 'Today, 11:59 AM',
  },
]

const activities = [
  {
    id: 1,
    message: 'Changed the style.',
    avatar: '🎨',
    time: 'Just now',
  },
  {
    id: 2,
    message: 'Released a new version.',
    avatar: '👤',
    time: '59 minutes ago',
  },
  {
    id: 3,
    message: 'Submitted a bug.',
    avatar: '👤',
    time: '12 hours ago',
  },
  {
    id: 4,
    message: 'Modified A data in Page X.',
    avatar: '👤',
    time: 'Today, 11:59 AM',
  },
  {
    id: 5,
    message: 'Deleted a page in Project X.',
    avatar: '👤',
    time: 'Feb 2, 2025',
  },
]

const contacts = [
  { id: 1, name: 'Natali Craig', avatar: '👤' },
  { id: 2, name: 'Drew Cano', avatar: '👤' },
  { id: 3, name: 'Andi Lane', avatar: '👤' },
  { id: 4, name: 'Koray Okumus', avatar: '👤' },
  { id: 5, name: 'Kate Morrison', avatar: '👤' },
  { id: 6, name: 'Melody Macy', avatar: '👤' },
]

export default function RightSidebar() {
  return (
    <aside className="right-sidebar">
      <div className="right-sidebar-content">
        <div className="right-sidebar-section">
          <h3 className="right-sidebar-title">Notifications</h3>
          <div className="right-sidebar-list">
            {notifications.map((notification) => {
              const Icon = notification.icon
              return (
                <div key={notification.id} className="right-sidebar-item">
                  <div className="right-sidebar-item-icon">
                    <Icon size={16} strokeWidth={2} />
                  </div>
                  <div className="right-sidebar-item-content">
                    <div className="right-sidebar-item-text">{notification.message}</div>
                    <div className="right-sidebar-item-time">{notification.time}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="right-sidebar-section">
          <h3 className="right-sidebar-title">Activities</h3>
          <div className="right-sidebar-list">
            {activities.map((activity) => (
              <div key={activity.id} className="right-sidebar-item">
                <div className="right-sidebar-item-avatar">{activity.avatar}</div>
                <div className="right-sidebar-item-content">
                  <div className="right-sidebar-item-text">{activity.message}</div>
                  <div className="right-sidebar-item-time">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="right-sidebar-section">
          <h3 className="right-sidebar-title">Contacts</h3>
          <div className="right-sidebar-list">
            {contacts.map((contact) => (
              <div key={contact.id} className="right-sidebar-item right-sidebar-contact">
                <div className="right-sidebar-item-avatar">{contact.avatar}</div>
                <div className="right-sidebar-item-text">{contact.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}

