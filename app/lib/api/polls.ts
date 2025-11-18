import api from "../axiosInstance";

export const fetchPollsRequest = async () => {
  const res = await api.get("/polls");
  return res.data;
};

export const fetchPollByIdRequest = async (id: string) => {
  const res = await api.get(`/polls/${id}`);
  return res.data;
};

export const createPollRequest = async (data: { title: string; description?: string; options: string[] }) => {
  const res = await api.post("/polls", data);
  return res.data;
};

export const closePollRequest = async (id: string) => {
  const res = await api.post(`/polls/${id}/close`);
  return res.data;
};

export const submitVoteRequest = async (pollId: string, optionId: string) => {
  const res = await api.post(`/polls/${pollId}/vote`, { optionId });
  return res.data;
};
