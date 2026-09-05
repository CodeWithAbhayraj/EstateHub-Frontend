import api from "./axios";

// ==========================================
// ADMIN - GET ALL USERS
// ==========================================
export const getAllUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

// ==========================================
// ADMIN - GET USER BY ID
// ==========================================
export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

// ==========================================
// ADMIN - ENABLE USER
// ==========================================
export const enableUser = async (id) => {
  const response = await api.patch(`/users/${id}/enable`);
  return response.data;
};

// ==========================================
// ADMIN - DISABLE USER
// ==========================================
export const disableUser = async (id) => {
  const response = await api.patch(`/users/${id}/disable`);
  return response.data;
};