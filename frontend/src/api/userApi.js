import axiosInstance from './axiosInstance';

export const getAllMembers = () => axiosInstance.get('/users/members');