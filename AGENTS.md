# AGENTS.md - Centro de Atención Municipal Dashboard

## 🏛️ PROJECT OVERVIEW

**Sistema de Gestión Municipal de Reclamos y Solicitudes Ciudadanas**

Este proyecto es un dashboard web completo para la gestión de reclamos ciudadanos en un municipio. La plataforma permite a diferentes tipos de usuarios (call center, jefes de sector, choferes, administradores) acceder con credenciales específicas y gestionar tareas según su área de responsabilidad.

### 🎯 BUSINESS OBJECTIVES
- Centralizar la gestión de reclamos ciudadanos
- Optimizar la asignación y seguimiento de tareas municipales
- Mejorar la transparencia y eficiencia en la atención ciudadana
- Proporcionar métricas y reportes en tiempo real
- Facilitar la coordinación entre diferentes sectores municipales

---

## 🏗️ TECHNICAL ARCHITECTURE

### **Stack Tecnológico**
- **Frontend**: Next.js 16.0.10 + React 19.2.0 + TypeScript
- **Styling**: TailwindCSS 4.1.9 + Tailwind Animate
- **UI Components**: Radix UI + shadcn/ui components
- **State Management**: Zustand stores (auth, complaints, notifications)
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts 2.15.4
- **Date Handling**: date-fns 4.1.0
- **Icons**: Lucide React
- **Notifications**: Sonner

### **Project Structure**
```
centroatencionmunicipal/
├── app/                    # Next.js App Router
├── components/             # React components
│   ├── ui/                # shadcn/ui base components
│   ├── dashboard.tsx      # Main dashboard component
│   ├── complaints-table.tsx
│   ├── stats-cards.tsx
│   └── ...
├── lib/                   # Business logic & utilities
│   ├── types.ts          # TypeScript definitions
│   ├── auth-store.ts     # Authentication state
│   ├── complaint-store.ts # Complaints management
│   ├── mock-data.ts      # Development data
│   └── utils.ts
├── hooks/                 # Custom React hooks
├── public/               # Static assets
└── styles/               # Global styles
```

---

## 👥 USER ROLES & PERMISSIONS

### **1. Call Center (Centro de Llamadas)**
- **Responsabilidades**: Recepción y registro de reclamos ciudadanos
- **Acceso**: Dashboard completo, formulario de reclamos, tabla de seguimiento
- **Permisos**: Crear reclamos, modificar estados, asignar sectores

### **2. Sector Manager (Jefe de Sector)**
- **Sectores disponibles**:
  - Gobierno
  - Hacienda  
  - Obras y Servicios
  - Desarrollo Económico
  - Desarrollo Humano
  - Salud
  - Juzgado de Faltas
- **Acceso**: Vista filtrada por su sector específico
- **Permisos**: Gestionar reclamos de su sector, asignar choferes, cambiar estados

### **3. Driver (Chofer)**
- **Zonas de trabajo**: Norte, Sur, Centro, Este, Oeste
- **Acceso**: Vista de tareas asignadas por zona
- **Permisos**: Actualizar estado de tareas, marcar como completadas

### **4. Admin (Administrador)**
- **Acceso**: Vista completa del sistema, métricas globales
- **Permisos**: Gestión completa, reportes, configuración del sistema

---

## 📊 DATA MODELS

### **Complaint (Reclamo)**
```typescript
interface Complaint {
  id: string                    // RECLAMO-XXXX format
  createdAt: Date              // Timestamp de creación
  citizenName: string          // Nombre del ciudadano
  address: string              // Dirección del reclamo
  contactInfo: string          // Teléfono de contacto
  description: string          // Descripción detallada
  sector: Sector               // Sector responsable
  taskType: TaskType           // Tipo de tarea
  status: Status               // Estado actual
  zone: Zone                   // Zona geográfica
  assignedDriverId?: string    // Chofer asignado
  completedAt?: Date           // Fecha de completado
  latitude?: number            // Coordenada GPS
  longitude?: number           // Coordenada GPS
}
```

### **User (Usuario)**
```typescript
interface User {
  id: string
  name: string
  email: string
  role: UserRole               // Rol del usuario
  sector?: Sector              // Sector (para jefes)
  zone?: Zone                  // Zona (para choferes)
}
```

### **Status Types**
- **URGENTE**: Requiere atención inmediata
- **ESPERA**: En cola de procesamiento
- **LISTO**: Completado/Resuelto

### **Task Types**
- Alumbrado (iluminación pública)
- Descacharrado (limpieza de desechos)
- Corte de pasto
- Máquina de calle (bacheo, reparaciones)
- Medio ambiente
- Poda de árboles
- Agua (problemas de suministro)
- Atmosférico (contaminación, humos)

---

## 🎨 UI/UX DESIGN PATTERNS

### **Design System**
- **Color Scheme**: Sistema de colores adaptativos (light/dark mode)
- **Typography**: Sistema tipográfico escalable
- **Spacing**: Grid system basado en Tailwind
- **Components**: Biblioteca consistente con shadcn/ui

### **Responsive Design**
- **Mobile First**: Optimizado para dispositivos móviles
- **Breakpoints**: sm, md, lg, xl siguiendo Tailwind standards
- **Touch Friendly**: Botones y controles optimizados para touch

### **Accessibility**
- **ARIA Labels**: Componentes accesibles
- **Keyboard Navigation**: Navegación completa por teclado
- **Screen Reader**: Compatible con lectores de pantalla
- **Color Contrast**: Cumple estándares WCAG

---

## 🔐 AUTHENTICATION & AUTHORIZATION

### **Authentication Flow**
1. Login con email/password o selección de rol
2. Validación contra mock users o sistema externo
3. Establecimiento de sesión con Zustand store
4. Redirección a dashboard según rol

### **Authorization Matrix**
| Feature | Call Center | Sector Manager | Driver | Admin |
|---------|-------------|----------------|--------|-------|
| Ver todos los reclamos | ✅ | ❌ (solo su sector) | ❌ (solo su zona) | ✅ |
| Crear reclamos | ✅ | ✅ | ❌ | ✅ |
| Asignar choferes | ❌ | ✅ | ❌ | ✅ |
| Cambiar estados | ✅ | ✅ | ✅ (limitado) | ✅ |
| Ver métricas globales | ✅ | ❌ | ❌ | ✅ |

---

## 📈 DASHBOARD FEATURES

### **Main Dashboard Components**

#### **1. Stats Cards**
- Total de reclamos
- Reclamos urgentes
- Reclamos en espera
- Reclamos completados
- Métricas por período

#### **2. Filters Panel**
- Filtro por fecha (date picker)
- Filtro por sector
- Filtro por tipo de tarea
- Filtro por estado
- Botón de limpiar filtros

#### **3. Complaints Table**
- Vista tabular con paginación
- Ordenamiento por columnas
- Acciones inline (cambio de estado)
- Vista responsive (cards en mobile)
- Agrupación por fecha

#### **4. Notifications Panel**
- Notificaciones en tiempo real
- Cambios de estado
- Asignaciones nuevas
- Sistema de badges

### **Form Components**
- **Complaint Form**: Registro de nuevos reclamos
- **Status Update**: Cambio de estados con validación
- **Assignment Form**: Asignación de choferes por zona

---

## 🔄 STATE MANAGEMENT

### **Auth Store**
```typescript
// Gestión de autenticación y usuario actual
- currentUser: User | null
- login(role, zone?, sector?)
- logout()
- subscribe(listener)
```

### **Complaint Store**
```typescript
// Gestión de reclamos y operaciones CRUD
- complaints: Complaint[]
- addComplaint(complaint)
- updateStatus(id, status)
- assignDriver(id, driverId)
- getByFilters(filters)
```

### **Notification Store**
```typescript
// Sistema de notificaciones
- notifications: Notification[]
- addNotification(notification)
- markAsRead(id)
- clearAll()
```

---

## 🚀 DEVELOPMENT WORKFLOW

### **Getting Started**
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### **Code Standards**
- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for Next.js + React
- **Prettier**: Code formatting
- **Conventional Commits**: Git commit standards

### **Component Development**
1. Create component in appropriate directory
2. Export from index files
3. Add TypeScript interfaces
4. Include responsive design
5. Add accessibility attributes

---

## 🧪 TESTING STRATEGY

### **Mock Data**
- `generateMockComplaints()`: Genera datos de prueba
- `mockUsers[]`: Usuarios del sistema
- Datos realistas para desarrollo y testing

### **Test Coverage Areas**
- Component rendering
- User interactions
- State management
- Form validation
- Authentication flows
- Responsive behavior

---

## 🔧 CONFIGURATION

### **Environment Variables**
```env
NEXT_PUBLIC_APP_NAME="Centro de Atención Municipal"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

### **Next.js Configuration**
- App Router enabled
- TypeScript strict mode
- Tailwind CSS integration
- Image optimization

---

## 📱 MOBILE OPTIMIZATION

### **Mobile-First Features**
- Collapsible sidebar navigation
- Touch-optimized buttons and controls
- Responsive tables (convert to cards)
- Swipe gestures for actions
- Optimized form inputs

### **Performance**
- Code splitting by route
- Lazy loading of components
- Image optimization
- Bundle size optimization

---

## 🔮 FUTURE ENHANCEMENTS

### **Phase 2 Features**
- Real-time notifications with WebSockets
- GPS integration for location tracking
- Photo upload for complaints
- PDF report generation
- Email notifications
- Mobile app (React Native)

### **Integration Opportunities**
- Municipal database integration
- GIS mapping system
- Payment gateway for fines
- SMS notification service
- WhatsApp Business API

---

## 🎯 BUSINESS RULES

### **Complaint Lifecycle**
1. **Creación**: Call center registra reclamo
2. **Asignación**: Jefe de sector asigna a chofer
3. **En Proceso**: Chofer actualiza estado
4. **Completado**: Tarea marcada como lista
5. **Seguimiento**: Notificaciones automáticas

### **Priority Rules**
- URGENTE: Atención inmediata (< 24h)
- ESPERA: Procesamiento normal (< 72h)
- LISTO: Completado y archivado

### **Assignment Logic**
- Reclamos se asignan por zona geográfica
- Choferes especializados por tipo de tarea
- Balanceador de carga automático

---

## 📋 TECHNICAL DEBT & IMPROVEMENTS

### **Current Limitations**
- Mock data instead of real database
- No real-time updates
- Limited offline capability
- Basic error handling

### **Recommended Improvements**
- Implement proper backend API
- Add comprehensive error boundaries
- Enhance loading states
- Add unit and integration tests
- Implement caching strategy

---

## 🤝 COLLABORATION GUIDELINES

### **For Developers**
- Follow TypeScript strict mode
- Use existing component patterns
- Maintain responsive design
- Add proper error handling
- Document complex logic

### **For Designers**
- Follow established design system
- Maintain accessibility standards
- Consider mobile-first approach
- Use consistent spacing and typography

### **For Product Managers**
- User stories should map to specific roles
- Consider municipal workflow requirements
- Prioritize citizen experience
- Plan for scalability

---

**Arquitecto de Software Senior**  
*Experiencia: Amazon, MercadoLibre, eBay*  
*Especialización: Sistemas Municipales, Dashboards Empresariales, Arquitecturas Escalables*

---

*Este documento sirve como contexto completo para el desarrollo continuo del sistema. Actualizar según evolución del proyecto.*