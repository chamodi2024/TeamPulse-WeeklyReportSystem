import axiosInstance from './axiosInstance';

export const getAiSummary = (weekStart, weekEnd) =>
  axiosInstance.get('/assistant/summary', { params: { weekStart, weekEnd } });

export const askAi = (question, weekStart, weekEnd) =>
  axiosInstance.post('/assistant/ask', { question, weekStart, weekEnd });