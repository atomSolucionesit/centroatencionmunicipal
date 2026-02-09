import apiClient from "./client";

export interface ApiComplaint {
  id: string;
  citizenName: string;
  citizenDni?: string;
  address: string;
  contactInfo: string;
  description: string;
  sector: string;
  taskType: string;
  area?: string;
  status: 'URGENTE' | 'ESPERA' | 'EN_PROCESO' | 'LISTO';
  assignedDriverId?: string;
  taskId?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
  assignedDriver?: {
    id: string;
    firstName: string;
    email: string;
  };
  task?: {
    id: string;
    status: string;
    createdAt: string;
  };
  observations?: {
    id: string;
    observation: string;
    createdAt: string;
    userId: string;
  }[];
}

export interface CreateComplaintRequest {
  citizenName: string;
  citizenDni?: string;
  address: string;
  contactInfo: string;
  description: string;
  sector: string;
  taskType: string;
  latitude?: number;
  longitude?: number;
}

class ComplaintsApiService {
  async createComplaint(data: CreateComplaintRequest): Promise<ApiComplaint> {
    const response = await apiClient.post('/complaints', data);
    return response.data;
  }

  async getComplaints(status?: string, sector?: string): Promise<ApiComplaint[]> {
    const params: any = {};
    if (status) params.status = status;
    if (sector) params.sector = sector;

    const response = await apiClient.get('/complaints', { params });
    return response.data;
  }

  async updateComplaintStatus(id: string, status: string): Promise<ApiComplaint> {
    const response = await apiClient.patch(`/complaints/${id}/status`, { status });
    return response.data;
  }

  async updateComplaintArea(id: string, area: string): Promise<ApiComplaint> {
    const response = await apiClient.patch(`/complaints/${id}/area`, { area });
    return response.data;
  }

  async assignDriver(id: string, driverId: string): Promise<ApiComplaint> {
    const response = await apiClient.patch(`/complaints/${id}/assign`, { driverId });
    return response.data;
  }

  async convertToTask(id: string): Promise<any> {
    const response = await apiClient.post(`/complaints/${id}/convert-to-task`);
    return response.data;
  }

  async addObservation(id: string, observation: string): Promise<any> {
    const response = await apiClient.post(`/complaints/${id}/observations`, { observation });
    return response.data;
  }

  async getComplaint(id: string): Promise<ApiComplaint> {
    const response = await apiClient.get(`/complaints/${id}`);
    return response.data;
  }
}

export const complaintsApi = new ComplaintsApiService();