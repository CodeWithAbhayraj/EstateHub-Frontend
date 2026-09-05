import api from "./axios";

// ==========================================
// ADMIN - GET ALL COMMISSIONS
// ==========================================
export const getAllCommissions = async () => {
  const response = await api.get("/commissions");
  return response.data;
};

// ==========================================
// ADMIN - GET COMMISSION BY ID
// ==========================================
export const getCommissionById = async (id) => {
  const response = await api.get(`/commissions/${id}`);
  return response.data;
};

// ==========================================
// ADMIN - GET COMMISSION BY DEAL ID
// ==========================================
export const getCommissionByDealId = async (dealId) => {
  const response = await api.get(
    `/commissions/deal/${dealId}`
  );
  return response.data;
};

// ==========================================
// ADMIN - CREATE COMMISSION
// ==========================================
export const createCommission = async (commissionData) => {
  const response = await api.post(
    "/commissions",
    commissionData
  );
  return response.data;
};

// ==========================================
// ADMIN - UPDATE PAYMENT STATUS
// ==========================================
export const updatePaymentStatus = async (
  id,
  paymentStatus
) => {
  const response = await api.patch(
    `/commissions/${id}/payment-status`,
    null,
    {
      params: {
        paymentStatus,
      },
    }
  );

  return response.data;
};