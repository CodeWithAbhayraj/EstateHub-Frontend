import api from "./axios";

// ==========================================
// GET ALL PUBLISHED PROPERTIES
// ==========================================
export const getPublishedProperties = async () => {
  const response = await api.get("/properties");
  return response.data;
};

// ==========================================
// GET PROPERTY BY ID
// ==========================================
export const getPropertyById = async (id) => {
  const response = await api.get(`/properties/${id}`);
  return response.data;
};

// ==========================================
// SELLER - GET MY PROPERTIES
// ==========================================
export const getMyProperties = async () => {
  const response = await api.get("/properties/my");
  return response.data;
};

// ==========================================
// SELLER - CREATE PROPERTY
// ==========================================
export const createProperty = async (propertyData) => {
  const response = await api.post("/properties", propertyData);
  return response.data;
};

// ==========================================
// SELLER - UPDATE PROPERTY
// ==========================================
export const updateProperty = async (id, propertyData) => {
  const response = await api.put(`/properties/${id}`, propertyData);
  return response.data;
};

// ==========================================
// SELLER - DELETE PROPERTY
// ==========================================
export const deleteProperty = async (id) => {
  const response = await api.delete(`/properties/${id}`);
  return response.data;
};

// ==========================================
// SELLER - SUBMIT PROPERTY FOR APPROVAL
// ==========================================
export const submitPropertyForApproval = async (id) => {
  const response = await api.patch(`/properties/${id}/submit`);
  return response.data;
};

// ==========================================
// ADMIN - APPROVE PROPERTY
// ==========================================
export const approveProperty = async (id) => {
  const response = await api.patch(`/properties/${id}/approve`);
  return response.data;
};

// ==========================================
// ADMIN - REJECT PROPERTY
// ==========================================
export const rejectProperty = async (id, reason) => {
  const response = await api.patch(
    `/properties/${id}/reject`,
    null,
    {
      params: {
        reason,
      },
    }
  );

  return response.data;
};