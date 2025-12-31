import { api } from '@/lib/axios';

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

export const registerUser = async (payload: RegisterPayload) => {
  const res = await api.post('/auth/register', payload);
  return res.data;
};

export const loginUser = async (payload: LoginPayload) => {
  const res = await api.post('/auth/login', payload);
  return res.data;
};

export const logoutUser = async () => {
  await api.post('/auth/logout', {});
};
