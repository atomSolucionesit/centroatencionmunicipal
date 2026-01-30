"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Bell, Check, CheckCheck, Trash2, ArrowRight } from "lucide-react"
import { notificationStore } from "@/lib/notification-store"
import type { StatusChangeNotification } from "@/lib/types"
import { StatusBadge } from "./status-badge"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

export function NotificationsPanel() {
  const [notifications, setNotifications] = useState<StatusChangeNotification[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setNotifications(notificationStore.getNotifications())
    const unsubscribe = notificationStore.subscribe(setNotifications)
    return unsubscribe
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAsRead = (id: string) => {
    notificationStore.markAsRead(id)
  }

  const handleMarkAllAsRead = () => {
    notificationStore.markAllAsRead()
  }

  const handleClearAll = () => {
    notificationStore.clearAll()
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={`Notificaciones${unreadCount > 0 ? `, ${unreadCount} sin leer` : ""}`}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[calc(100vw-2rem)] sm:w-96 max-w-[400px] p-0" align="end">
        <div className="flex items-center justify-between border-b border-border px-3 sm:px-4 py-2 sm:py-3">
          <h3 className="text-sm sm:text-base font-semibold text-foreground">Notificaciones</h3>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="h-8 px-2 text-xs"
              >
                <CheckCheck className="mr-1 h-3.5 w-3.5" />
                Marcar todo
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
        <ScrollArea className="max-h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="mb-3 h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No hay notificaciones
              </p>
              <p className="text-xs text-muted-foreground/70">
                Los cambios de estado apareceran aqui
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-2 sm:gap-3 p-3 sm:p-4 transition-colors ${
                    !notification.read ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-muted-foreground">
                        {notification.complaintId}
                      </span>
                      {!notification.read && (
                        <span className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="text-sm text-foreground truncate mb-2">
                      {notification.complaintAddress}
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                      <StatusBadge status={notification.previousStatus} />
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <StatusBadge status={notification.newStatus} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {format(notification.changedAt, "dd MMM HH:mm", { locale: es })} por {notification.changedBy}
                    </p>
                  </div>
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <Check className="h-4 w-4" />
                      <span className="sr-only">Marcar como leida</span>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
