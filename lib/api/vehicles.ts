import apiClient from './client';

export interface Vehicle {
  id: string;
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  fuelType: string;
  horsePower?: number;
  status: string;
  createdAt: string;
}

export interface CreateVehicleRequest {
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  fuelType: string;
  horsePower?: number;
}

class VehiclesApiService {
  async getVehicles(): Promise<Vehicle[]> {
    const response = await apiClient.get('/vehicles');
    return response.data;
  }

  async createVehicle(data: CreateVehicleRequest): Promise<Vehicle> {
    const response = await apiClient.post('/vehicles', data);
    return response.data;
  }

  async deleteVehicle(id: string): Promise<void> {
    await apiClient.delete(`/vehicles/${id}`);
  }
}

export const vehiclesApi = new VehiclesApiService();