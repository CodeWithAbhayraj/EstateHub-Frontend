import api from "./axios";

// ==========================================
// ADMIN - GET ALL VISITS
// ==========================================
export const getAllVisits = async () => {
  const response = await api.get("/visits");
  return response.data;
};

// ==========================================
// GET VISIT BY ID
// ==========================================
export const getVisitById = async (id) => {
  const response = await api.get(`/visits/${id}`);
  return response.data;
};

// ==========================================
// BUYER - GET MY VISITS
// ==========================================
export const getMyVisits = async () => {
  const response = await api.get("/visits/my");
  return response.data;
};

// ==========================================
// ADMIN - GET VISITS BY BUYER
// ==========================================
export const getVisitsByBuyer = async (buyerId) => {
  const response = await api.get(`/visits/buyer/${buyerId}`);
  return response.data;
};

// ==========================================
// ADMIN - GET VISITS BY LEAD
// ==========================================
export const getVisitsByLead = async (leadId) => {
  const response = await api.get(`/visits/lead/${leadId}`);
  return response.data;
};

// ==========================================
// ADMIN - GET VISITS BY PROPERTY
// ==========================================
export const getVisitsByProperty = async (propertyId) => {
  const response = await api.get(`/visits/property/${propertyId}`);
  return response.data;
};

// ==========================================
// BUYER - CREATE VISIT
// ==========================================
export const createVisit = async (visitData) => {
  const response = await api.post("/visits", visitData);
  return response.data;
};

// ==========================================
// ADMIN - UPDATE VISIT STATUS
// ==========================================
export const updateVisitStatus = async (id, statusData) => {
  const response = await api.patch(
    `/visits/${id}/status`,
    statusData
  );
  return response.data;
};