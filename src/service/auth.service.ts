import { ILoginResponse, IProfileResponse } from "../types/types";

import { ZohoTokenStore } from "../stores/zoho.store";
import api from "../constants/api";
import client from "./axios.service";

export const login = async (data: { email: string; password: string }) => {
  const response = await client.post<ILoginResponse>(api.LOGIN, data);
  return response.data.data;
};
export const getProfile = async () => {
  const response = await client.get<IProfileResponse>(api.PROFILE);
  return response.data.data;
};

// ZOHO

export const getZohoToken = async (code: string) => {
  const response = await client.post<{ data: ZohoTokenStore }>(api.ZOHO_TOKEN, {
    code,
  });
  return response.data;
};
