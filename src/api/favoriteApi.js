import api from "./axios";

// ==========================================
// ADD PROPERTY TO FAVORITES
// ==========================================
export const addFavorite = async (propertyId) => {
  const response = await api.post(`/favorites/${propertyId}`);
  return response.data;
};

// ==========================================
// REMOVE PROPERTY FROM FAVORITES
// ==========================================
export const removeFavorite = async (propertyId) => {
  const response = await api.delete(`/favorites/${propertyId}`);
  return response.data;
};

// ==========================================
// GET MY FAVORITES
// ==========================================
export const getMyFavorites = async () => {
  const response = await api.get("/favorites");
  return response.data;
};

// ==========================================
// CHECK IF PROPERTY IS FAVORITE
// ==========================================
export const isFavorite = async (propertyId) => {
  const response = await api.get(`/favorites/${propertyId}`);
  return response.data;
};