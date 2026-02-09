export type Status = "URGENTE" | "ESPERA" | "EN_PROCESO" | "LISTO"

export type UserRole = "call-center" | "sector-manager" | "driver" | "admin"

export type Zone = "Norte" | "Sur" | "Centro" | "Este" | "Oeste"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  sector?: Sector
  zone?: Zone
}

export interface Driver extends User {
  role: "driver"
  zone: Zone
  assignedTasks: string[]
}

export const ZONES: Zone[] = ["Norte", "Sur", "Centro", "Este", "Oeste"]

export const ROLE_LABELS: Record<UserRole, string> = {
  "call-center": "Centro de Llamadas",
  "sector-manager": "Jefe de Sector",
  "driver": "Chofer",
  "admin": "Administrador",
}

export type Sector =
  | "Gobierno"
  | "Hacienda"
  | "Obras y Servicios"
  | "Desarrollo Económico"
  | "Desarrollo Humano"
  | "Salud"
  | "Juzgado de Faltas"

export type TaskType =
  | "Alumbrado"
  | "Descacharrado"
  | "Corte de pasto"
  | "Máquina de calle"
  | "Medio ambiente"
  | "Poda"
  | "Agua"
  | "Atmosférico"

export interface Complaint {
  id: string
  createdAt: Date
  citizenName: string
  citizenDni: string
  address: string
  contactInfo: string
  description: string
  sector: Sector
  taskType: TaskType
  area?: string
  status: Status
  zone: Zone
  assignedDriverId?: string
  completedAt?: Date
  latitude?: number
  longitude?: number
}

export const SECTORS: Sector[] = [
  "Gobierno",
  "Hacienda",
  "Obras y Servicios",
  "Desarrollo Económico",
  "Desarrollo Humano",
  "Salud",
  "Juzgado de Faltas",
]

export const TASK_TYPES: TaskType[] = [
  "Alumbrado",
  "Descacharrado",
  "Corte de pasto",
  "Máquina de calle",
  "Medio ambiente",
  "Poda",
  "Agua",
  "Atmosférico",
]

export const STATUSES: Status[] = ["URGENTE", "ESPERA", "EN_PROCESO", "LISTO"]

export interface StatusChangeNotification {
  id: string
  complaintId: string
  complaintAddress: string
  previousStatus: Status
  newStatus: Status
  changedAt: Date
  changedBy: string
  read: boolean
}
