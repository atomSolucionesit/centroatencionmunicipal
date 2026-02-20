import apiClient from './client';

export interface DriverStatus {
  driver: {
    id: string;
    name: string;
    email: string;
  };
  status: string;
  activeTask: {
    id: string;
    type: string;
    description: string;
    address: string;
    priority: string;
    assignedAt: string;
  } | null;
  vehicle: {
    id: string;
    licensePlate: string;
    brand: string;
    model: string;
  } | null;
  tracking: {
    sessionId: string;
    startTime: string;
    lastHeartbeat: string;
    riskLevel: string;
  } | null;
  lastLocation: {
    lat: number;
    lng: number;
    timestamp: string;
  } | null;
  locationHistory?: {
    lat: number;
    lng: number;
    timestamp: string;
  }[];
}

class TasksApiService {
  async getDriversStatus(): Promise<DriverStatus[]> {
    const response = await apiClient.get('/tasks/drivers/status');
    return response.data;
  }
}

export const tasksApi = new TasksApiService();
