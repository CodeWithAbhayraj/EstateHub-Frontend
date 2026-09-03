import api from "./axios";

// Get all published properties
export const getPublishedProperties = async () => {
  const response = await api.get("/properties");
  return response.data;
};

// Get all properties for admin
export const getAllPropertiesForAdmin = async () => {
  const response = await api.get("/properties/admin/all");
  return response.data;
};

// Get property by ID
export const getPropertyById = async (id) => {
  const response = await api.get(`/properties/${id}`);
  return response.data;
};

// Get seller's own properties
export const getMyProperties = async () => {
  const response = await api.get("/properties/my");
  return response.data;
};

// Create new property
export const createProperty = async (propertyData) => {
  const response = await api.post("/properties", propertyData);
  return response.data;
};

// Update seller's own property
export const updateProperty = async (id, propertyData) => {
  const response = await api.put(
    `/properties/${id}`,
    propertyData
  );
  return response.data;
};

// Delete seller's own property
export const deleteProperty = async (id) => {
  await api.delete(`/properties/${id}`);
};

// Submit property for admin approval
export const submitPropertyForApproval = async (id) => {
  const response = await api.patch(
    `/properties/${id}/submit`
  );
  return response.data;
};

// Admin approve property
export const approveProperty = async (id) => {
  const response = await api.patch(
    `/properties/${id}/approve`
  );
  return response.data;
};

// Admin reject property
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