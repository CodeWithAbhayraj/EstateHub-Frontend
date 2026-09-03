import api from "./axios";

// Create lead as BUYER
export const createLead = async (leadData) => {
  const response = await api.post("/leads", leadData);
  return response.data;
};

// ADMIN - Get all leads
export const getAllLeads = async () => {
  const response = await api.get("/leads");
  return response.data;
};

// ADMIN - Get lead by ID
export const getLeadById = async (id) => {
  const response = await api.get(`/leads/${id}`);
  return response.data;
};

// ADMIN - Update lead status
export const updateLeadStatus = async (id, statusData) => {
  const response = await api.patch(
    `/leads/${id}/status`,
    statusData
  );

  return response.data;
};