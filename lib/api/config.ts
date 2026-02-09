import apiClient from "./client";

export interface Sector {
  id: string;
  organizationId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskTypeConfig {
  id: string;
  organizationId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

class ConfigApiService {
  async getSectors(): Promise<Sector[]> {
    const response = await apiClient.get("/complaints/config/sectors");
    return response.data;
  }

  async getTaskTypes(): Promise<TaskTypeConfig[]> {
    const response = await apiClient.get("/complaints/config/task-types");
    return response.data;
  }

  async createSector(name: string): Promise<Sector> {
    const response = await apiClient.post("/complaints/config/sectors", {
      name,
    });
    return response.data;
  }

  async createTaskType(name: string): Promise<TaskTypeConfig> {
    const response = await apiClient.post("/complaints/config/task-types", {
      name,
    });
    return response.data;
  }
}

export const configApi = new ConfigApiService();
