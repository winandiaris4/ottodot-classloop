'use client'

import React, { useState, useEffect, useTransition } from 'react'
import {
  fetchNotificationsAction,
  markNotificationAsReadAction,
  markAllNotificationsAsReadAction,
  NotificationItem,
} from '@/lib/actions/notification'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Bell,
  CheckCheck,
  BookOpen,
  Award,
  FileCheck,
  Info,
  Loader2,
} from 'lucide-react'

export function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState<number>(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Load notifications on mount and whenever popover opens
  const loadNotifications = async () => {
    const res = await fetchNotificationsAction()
    if (res.success) {
      setNotifications(res.notifications)
      setUnreadCount(res.unreadCount)
    }
  }

  useEffect(() => {
    loadNotifications()
    // Poll every 30 seconds for background updates
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const formData = new FormData()
    formData.append('notificationId', id)

    // Optimistic UI update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))

    startTransition(async () => {
      await markNotificationAsReadAction(null, formData)
    })
  }

  const handleMarkAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Optimistic UI update
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    setUnreadCount(0)

    startTransition(async () => {
      await markAllNotificationsAsReadAction()
    })
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'homework_assigned':
        return <BookOpen className="w-4 h-4 text-indigo-600" />
      case 'homework_graded':
      case 'grade_released':
        return <Award className="w-4 h-4 text-emerald-600" />
      case 'homework_submitted':
      case 'homework_new':
        return <FileCheck className="w-4 h-4 text-blue-600" />
      default:
        return <Info className="w-4 h-4 text-slate-600" />
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none">
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 sm:w-96 p-0 max-h-[460px] overflow-y-auto">
        {/* Header */}
        <div className="p-3 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-900">Notifications</span>
            {unreadCount > 0 && (
              <Badge className="bg-indigo-100 text-indigo-700 text-[10px] font-bold hover:bg-indigo-100">
                {unreadCount} new
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={isPending}
              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Mark all read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-slate-400 space-y-1">
              <Bell className="w-6 h-6 mx-auto text-slate-300" />
              <p className="text-xs font-medium text-slate-600">No notifications</p>
              <p className="text-[11px] text-slate-400">You&apos;re all caught up!</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={(e) => !n.is_read && handleMarkAsRead(n.id, e)}
                className={`p-3 transition-colors flex gap-3 cursor-pointer ${
                  !n.is_read ? 'bg-indigo-50/40 hover:bg-indigo-50/70' : 'bg-white hover:bg-slate-50'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {getNotificationIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <p className={`text-xs ${!n.is_read ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                      {n.title}
                    </p>
                    {!n.is_read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0 mt-1" />
                    )}
                  </div>
                  {n.body && (
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                      {n.body}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-400 mt-1">
                    {new Date(n.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
