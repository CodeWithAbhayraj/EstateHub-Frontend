import api from "./axios";

// ==========================================
// CITIES
// ==========================================

// Get all cities
export const getCities = async () => {
  const response = await api.get("/location/cities");
  return response.data;
};

// Get city by ID
export const getCityById = async (cityId) => {
  const response = await api.get(`/location/cities/${cityId}`);
  return response.data;
};

// Search cities
export const searchCities = async (name) => {
  const response = await api.get("/location/cities/search", {
    params: {
      name,
    },
  });

  return response.data;
};

// Create city (Admin)
export const createCity = async (cityData) => {
  const response = await api.post("/location/cities", cityData);
  return response.data;
};


// ==========================================
// AREAS
// ==========================================

// Get areas by city
export const getAreasByCity = async (cityId) => {
  const response = await api.get(`/location/cities/${cityId}/areas`);
  return response.data;
};

// Search areas
export const searchAreas = async (name, cityId) => {
  const response = await api.get("/location/areas/search", {
    params: {
      name,
      cityId,
    },
  });

  return response.data;
};

// Create area under city (Admin)
export const createArea = async (cityId, areaData) => {
  const response = await api.post(
    `/location/cities/${cityId}/areas`,
    areaData
  );

  return response.data;
};


// ==========================================
// PROPERTY TYPES
// ==========================================

// Get property types by area
export const getPropertyTypesByArea = async (areaId) => {
  const response = await api.get(
    `/location/areas/${areaId}/property-types`
  );

  return response.data;
};

// Get property type by ID
export const getPropertyTypeById = async (id) => {
  const response = await api.get(`/location/property-types/${id}`);
  return response.data;
};

// Search property types
export const searchPropertyTypes = async (name, areaId) => {
  const response = await api.get(
    "/location/property-types/search",
    {
      params: {
        name,
        areaId,
      },
    }
  );

  return response.data;
};