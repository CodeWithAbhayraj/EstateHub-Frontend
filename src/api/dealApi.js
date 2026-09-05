import api from "./axios";

// ==========================================
// ADMIN - GET ALL DEALS
// ==========================================
export const getAllDeals = async () => {
  const response = await api.get("/deals");
  return response.data;
};

// ==========================================
// ADMIN - GET DEAL BY ID
// ==========================================
export const getDealById = async (id) => {
  const response = await api.get(`/deals/${id}`);
  return response.data;
};

// ==========================================
// ADMIN - CREATE DEAL
// ==========================================
export const createDeal = async (dealData) => {
  const response = await api.post("/deals", dealData);
  return response.data;
};

// ==========================================
// ADMIN - UPDATE DEAL STATUS
// ==========================================
export const updateDealStatus = async (id, status) => {
  const response = await api.patch(
    `/deals/${id}/status`,
    {
      status,
    }
  );

  return response.data;
};