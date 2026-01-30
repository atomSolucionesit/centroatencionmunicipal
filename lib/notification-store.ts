"use client"

import type { Status, StatusChangeNotification } from "./types"

type Listener = (notifications: StatusChangeNotification[]) => void

class NotificationStore {
  private notifications: StatusChangeNotification[] = []
  private listeners: Set<Listener> = new Set()

  subscribe(listener: Listener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notify() {
    for (const listener of this.listeners) {
      listener([...this.notifications])
    }
  }

  addNotification(
    complaintId: string,
    complaintAddress: string,
    previousStatus: Status,
    newStatus: Status,
    changedBy: string = "Operador"
  ) {
    // Verificar si ya existe una notificación duplicada reciente (últimos 2 segundos)
    const now = Date.now()
    const duplicate = this.notifications.find(
      (n) =>
        n.complaintId === complaintId &&
        n.previousStatus === previousStatus &&
        n.newStatus === newStatus &&
        now - n.changedAt.getTime() < 2000 // Dentro de los últimos 2 segundos
    )

    if (duplicate) {
      // Si ya existe una notificación duplicada, no agregar otra
      return duplicate
    }

    const notification: StatusChangeNotification = {
      id: `NOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      complaintId,
      complaintAddress,
      previousStatus,
      newStatus,
      changedAt: new Date(),
      changedBy,
      read: false,
    }
    this.notifications = [notification, ...this.notifications]
    this.notify()
    return notification
  }

  markAsRead(id: string) {
    this.notifications = this.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    )
    this.notify()
  }

  markAllAsRead() {
    this.notifications = this.notifications.map((n) => ({ ...n, read: true }))
    this.notify()
  }

  getNotifications() {
    return [...this.notifications]
  }

  getUnreadCount() {
    return this.notifications.filter((n) => !n.read).length
  }

  clearAll() {
    this.notifications = []
    this.notify()
  }
}

export const notificationStore = new NotificationStore()
