import api from "../axiosInstance";

export const loginRequest = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

export const registerRequest = async (name: string, email: string, password: string) => {
  const res = await api.post("/auth/register", { name, email, password });
  return res.data;
};

export const getProfileRequest = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};
