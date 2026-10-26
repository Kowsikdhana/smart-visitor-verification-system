import apiClient from './client';

export const residentService = {
  async getAllResidents() {
    const response = await apiClient.get('/residents');
    return response.data;
  },

  async searchResidents(query) {
    const params = query ? { query } : {};
    const response = await apiClient.get('/residents/search', { params });
    return response.data;
  },

  async getResidentById(id) {
    const response = await apiClient.get(`/residents/${id}`);
    return response.data;
  },

  async createResident(residentData) {
    const response = await apiClient.post('/residents', residentData);
    return response.data;
  }
};
