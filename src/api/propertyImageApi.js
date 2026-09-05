import api from "./axios";

// ==========================================
// SELLER - UPLOAD PROPERTY IMAGE
// ==========================================
export const uploadPropertyImage = async (
  propertyId,
  file
) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post(
    `/properties/${propertyId}/images`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// ==========================================
// GET PROPERTY IMAGES
// ==========================================
export const getPropertyImages = async (
  propertyId
) => {
  const response = await api.get(
    `/properties/${propertyId}/images`
  );

  return response.data;
};

// ==========================================
// SELLER - DELETE PROPERTY IMAGE
// ==========================================
export const deletePropertyImage = async (
  propertyId,
  imageId
) => {
  const response = await api.delete(
    `/properties/${propertyId}/images/${imageId}`
  );

  return response.data;
};