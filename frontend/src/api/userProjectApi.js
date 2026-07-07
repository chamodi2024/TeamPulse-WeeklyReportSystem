import axiosInstance from './axiosInstance';

export const assignUserToProject = (payload) => axiosInstance.post('/user-projects/assign', payload);
export const getProjectsForUser = (userId) => axiosInstance.get(`/user-projects/user/${userId}`);
export const removeAssignment = (userId, projectId) =>
  axiosInstance.delete(`/user-projects/user/${userId}/project/${projectId}`);