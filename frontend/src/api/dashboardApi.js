import axiosInstance from './axiosInstance';

export const getSummary = (weekStart, weekEnd) =>
  axiosInstance.get('/dashboard/summary', { params: { weekStart, weekEnd } });

export const getSubmissionStatus = (weekStart, weekEnd) =>
  axiosInstance.get('/dashboard/submission-status', { params: { weekStart, weekEnd } });

export const getTaskTrend = () => axiosInstance.get('/dashboard/task-trend');

export const getWorkloadDistribution = () => axiosInstance.get('/dashboard/workload-distribution');

export const getRecentActivity = () => axiosInstance.get('/dashboard/recent-activity');