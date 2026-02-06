import apiClient from './client';

export interface FuelLoad {
  id: string;
  vehicleId: string;
  quantity: number;
  pricePerLiter: number;
  totalCost: number;
  odometer?: number;
  station?: string;
  recordedAt: string;
  createdAt: string;
}

export interface CreateFuelLoadRequest {
  vehicleId: string;
  quantity: number;
  pricePerLiter: number;
  odometer?: number;
  station?: string;
  recordedAt?: string;
}

class FuelLoadsApiService {
  async createFuelLoad(data: CreateFuelLoadRequest): Promise<FuelLoad> {
    const response = await apiClient.post('/fuel-loads', data);
    return response.data;
  }

  async createMultipleFuelLoads(loads: CreateFuelLoadRequest[]): Promise<FuelLoad[]> {
    const response = await apiClient.post('/fuel-loads/bulk', { loads });
    return response.data;
  }
}

export const fuelLoadsApi = new FuelLoadsApiService();