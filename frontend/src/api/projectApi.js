import axiosInstance from './axiosInstance';

export const getAllProjects = () => axiosInstance.get('/projects');
export const getProjectById = (id) => axiosInstance.get(`/projects/${id}`);
export const createProject = (payload) => axiosInstance.post('/projects', payload);
export const updateProject = (id, payload) => axiosInstance.put(`/projects/${id}`, payload);
export const deleteProject = (id) => axiosInstance.delete(`/projects/${id}`);