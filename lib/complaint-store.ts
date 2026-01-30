"use client"

import { createContext, useContext } from "react"
import type { Complaint, Status, Sector, TaskType } from "./types"

export interface ComplaintStore {
  complaints: Complaint[]
  addComplaint: (complaint: Omit<Complaint, "id" | "createdAt" | "status">) => void
  updateStatus: (id: string, status: Status) => void
  getFilteredComplaints: (filters: {
    sector?: Sector | "all"
    taskType?: TaskType | "all"
    status?: Status | "all"
    date?: Date
  }) => Complaint[]
}

export const ComplaintContext = createContext<ComplaintStore | null>(null)

export function useComplaints() {
  const context = useContext(ComplaintContext)
  if (!context) {
    throw new Error("useComplaints must be used within a ComplaintProvider")
  }
  return context
}
