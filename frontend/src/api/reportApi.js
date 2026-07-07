import axiosInstance from './axiosInstance';

export const createReport = (payload) => axiosInstance.post('/reports', payload);
export const createAndSubmitReport = (payload) => axiosInstance.post('/reports/submit', payload);
export const updateReport = (id, payload) => axiosInstance.put(`/reports/${id}`, payload);
export const submitReport = (id) => axiosInstance.patch(`/reports/${id}/submit`);
export const getMyReports = () => axiosInstance.get('/reports/my');
export const getReportById = (id) => axiosInstance.get(`/reports/${id}`);
export const getTeamReports = (params) => axiosInstance.get('/reports/team', { params });