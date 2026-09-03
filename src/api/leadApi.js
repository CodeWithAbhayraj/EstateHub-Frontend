import api from "./axios";

export const createLead = async (leadData) => {
  const response = await api.post("/leads", leadData);
  return response.data;
};

export const getAllLeads = async () => {
  const response = await api.get("/leads");
  return response.data;
};

export const getLeadById = async (id) => {
  const response = await api.get(`/leads/${id}`);
  return response.data;
};

export const updateLeadStatus = async (id, statusData) => {
  const response = await api.patch(
    `/leads/${id}/status`,
    statusData
  );

  return response.data;
};