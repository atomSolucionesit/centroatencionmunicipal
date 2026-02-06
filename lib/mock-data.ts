// Este archivo contiene datos de prueba para desarrollo
// En producción, todos los datos vienen de la API

import type { Complaint, Sector, TaskType, Status, Zone } from "./types"

// Mantenemos las funciones de generación para testing si es necesario
const sectors: Sector[] = [
  "Gobierno",
  "Hacienda",
  "Obras y Servicios",
  "Desarrollo Económico",
  "Desarrollo Humano",
  "Salud",
  "Juzgado de Faltas",
]

const taskTypes: TaskType[] = [
  "Alumbrado",
  "Descacharrado",
  "Corte de pasto",
  "Máquina de calle",
  "Medio ambiente",
  "Poda",
  "Agua",
  "Atmosférico",
]

// Datos iniciales vacíos - ahora se cargan desde la API
export const initialComplaints: Complaint[] = []
