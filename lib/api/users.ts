import apiClient from "./client";

export interface User {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  correo: string;
  tipo: string;
  area?: string;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  password: string;
  role: string;
  area: string;
  organizationId: string;
}

class UsersApiService {
  async getUsers(consulta?: string): Promise<User[]> {
    const params = consulta ? { consulta } : {};
    const response = await apiClient.get("/users/search", { params });
    return response.data;
  }

  async createUser(data: CreateUserRequest): Promise<{ mensaje: string }> {
    const response = await apiClient.post("/users", data);
    return response.data;
  }

  async updateUser(id: string, data: Partial<CreateUserRequest>): Promise<{ mensaje: string }> {
    const response = await apiClient.put(`/users/${id}`, data);
    return response.data;
  }
}

export const usersApi = new UsersApiService();
