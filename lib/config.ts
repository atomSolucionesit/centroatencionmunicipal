// Utilidad para obtener el organizationId
// En producción, esto debería venir del contexto de autenticación del usuario

export const getOrganizationId = (): string => {
  // Por ahora retorna un ID hardcodeado
  // TODO: Obtener del contexto de autenticación o localStorage
  return process.env.NEXT_PUBLIC_ORGANIZATION_ID || "cm4zzqvvs0000zzqvvs0000zz"
}

export const getAuthToken = (): string | null => {
  // TODO: Obtener del localStorage o contexto de autenticación
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken')
  }
  return null
}

export const getApiUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
}
