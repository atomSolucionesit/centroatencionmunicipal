import apiClient from './client';

export interface FuelLoad {
  id: string;
  vehicleId: string;
  quantity: number;
  workUnit?: number;
  workUnitType?: string;
  station?: string;
  notes?: string;
  recordedAt: string;
  createdAt: string;
  vehicle?: any;
}

export interface CreateFuelLoadRequest {
  vehicleId: string;
  quantity: number;
  workUnit?: number;
  workUnitType?: string;
  station?: string;
  notes?: string;
  recordedAt?: string;
}

export interface MonthlyReportItem {
  vehiculo: string;
  codigo: string;
  tipo: string;
  combustible: string;
  medicion: string;
  consumo: string;
}

class FuelLoadsApiService {
  async createFuelLoad(data: CreateFuelLoadRequest): Promise<FuelLoad> {
    const response = await apiClient.post('/fuel-loads', data);
    return response.data;
  }

  async getFuelLoads(vehicleId?: string, startDate?: string, endDate?: string, page = 1, limit = 10): Promise<{ data: FuelLoad[]; total: number; page: number; limit: number; totalPages: number }> {
    const params: any = { page, limit };
    if (vehicleId) params.vehicleId = vehicleId;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await apiClient.get('/fuel-loads', { params });
    return response.data;
  }

  async getConsumption(vehicleId: string, startDate?: string, endDate?: string): Promise<any> {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await apiClient.get(`/fuel-loads/consumption/${vehicleId}`, { params });
    return response.data;
  }

  async getMonthlyReport(year: number, month: number): Promise<MonthlyReportItem[]> {
    const response = await apiClient.get('/fuel-loads/report/monthly', {
      params: { year, month },
    });
    return response.data;
  }

  async deleteMany(ids: string[]): Promise<{ deleted: number }> {
    const response = await apiClient.post('/fuel-loads/delete', { ids });
    return response.data;
  }
}

export const fuelLoadsApi = new FuelLoadsApiService();