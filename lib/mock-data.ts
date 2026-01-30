import type { Complaint, Sector, TaskType, Status, Zone } from "./types"

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

const statuses: Status[] = ["URGENTE", "ESPERA", "LISTO"]

const names = [
  "María González",
  "Juan Pérez",
  "Ana Rodríguez",
  "Carlos López",
  "Laura Martínez",
  "Roberto Sánchez",
  "Patricia Fernández",
  "Miguel García",
  "Carmen Díaz",
  "José Hernández",
  "Elena Torres",
  "Francisco Ruiz",
]

const streets = [
  "Av. San Martín",
  "Calle Belgrano",
  "Av. Rivadavia",
  "Calle Mitre",
  "Av. Libertad",
  "Calle Sarmiento",
  "Av. 25 de Mayo",
  "Calle Moreno",
  "Av. Colón",
  "Calle Urquiza",
]

const descriptions = [
  "Luminaria apagada desde hace varios días, genera inseguridad en la zona.",
  "Acumulación de basura y escombros en la vereda que impide el paso.",
  "El pasto está muy alto y hay presencia de alimañas.",
  "La calle tiene pozos grandes que dificultan el tránsito vehicular.",
  "Hay olor nauseabundo proveniente de desagüe tapado.",
  "Árbol con ramas caídas que obstruyen parcialmente la calle.",
  "Pérdida de agua importante en la vereda, genera charcos permanentes.",
  "Humo constante proveniente de quema de basura en terreno baldío.",
  "Falta de iluminación en toda la cuadra.",
  "Necesidad urgente de desmalezado en espacio público.",
  "Vereda rota que representa peligro para peatones.",
  "Contenedor de basura desbordado hace más de una semana.",
]

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generatePhone(): string {
  const prefix = ["351", "352", "353"]
  return `${randomItem(prefix)}-${Math.floor(1000000 + Math.random() * 9000000)}`
}

function generateAddress(): string {
  const number = Math.floor(100 + Math.random() * 4900)
  return `${randomItem(streets)} ${number}`
}

export function generateMockComplaints(count: number): Complaint[] {
  const complaints: Complaint[] = []
  const now = new Date()
  
  for (let i = 0; i < count; i++) {
    const hoursAgo = Math.floor(Math.random() * 72)
    const createdAt = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000)
    
    complaints.push({
      id: `RECLAMO-${String(1000 + i).padStart(4, "0")}`,
      createdAt,
      citizenName: randomItem(names),
      address: generateAddress(),
      contactInfo: generatePhone(),
      description: randomItem(descriptions),
      sector: randomItem(sectors),
      taskType: randomItem(taskTypes),
      status: randomItem(statuses),
    })
  }
  
  return complaints.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export const initialComplaints = generateMockComplaints(25)
