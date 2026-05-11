import api from "./axios";

export const getAdminUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

export const updateUserStatus = async (userId, status) => {
  const response = await api.put("/admin/users/status", { userId, status });
  return response.data;
};

export const getPendingProviders = async () => {
  const response = await api.get("/admin/providers/pending");
  return response.data;
};

export const getVerifiedProviders = async () => {
  const response = await api.get("/admin/providers/verified");
  return response.data;
};

export const getAdminProviderDetail = async (providerId) => {
  const response = await api.get(`/admin/providers/${providerId}`);
  return response.data;
};

export const updateProviderVerification = async (providerId, status) => {
  const response = await api.put("/admin/providers/verification", { providerId, status });
  return response.data;
};

export const updateProviderAccountStatus = async (providerId, status) => {
  const response = await api.put("/admin/providers/status", { providerId, status });
  return response.data;
};


export const getCategories = async () => {
  const response = await api.get("/admin/categories");
  return response.data;
};

export const createCategory = async (data) => {
  const response = await api.post("/admin/categories", data);
  return response.data;
};

export const updateCategory = async (id, data) => {
  const response = await api.put(`/admin/categories/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/admin/categories/${id}`);
  return response.data;
};
