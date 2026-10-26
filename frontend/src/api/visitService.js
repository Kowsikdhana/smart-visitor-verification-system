import apiClient from './client';

export const visitService = {
  async createVisit(visitData) {
    const response = await apiClient.post('/visits', visitData);
    return response.data;
  },

  async getCurrentVisits() {
    const response = await apiClient.get('/visits/current');
    return response.data;
  },

  async getVisitHistory(filters = {}) {
    const response = await apiClient.get('/visits/history', { params: filters });
    return response.data;
  },

  async getVisitById(id) {
    const response = await apiClient.get(`/visits/${id}`);
    return response.data;
  },

  async getVisitByPassCode(passCode) {
    const response = await apiClient.get(`/visits/pass/${passCode}`);
    return response.data;
  },

  async checkOutVisit(id) {
    const response = await apiClient.patch(`/visits/${id}/check-out`);
    return response.data;
  },

  async searchVisitorByPhone(phone) {
    try {
      const response = await apiClient.get('/visitors/search', { params: { phone } });
      return response.data;
    } catch (error) {
      if (error.status === 404) {
        return null; // Phone not found in visitor database
      }
      throw error;
    }
  },

  async getDashboardStats() {
    const response = await apiClient.get('/dashboard/stats');
    return response.data;
  }
};
