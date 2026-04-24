import { ISettingResponse } from "../types/types";
import { ISettingUpdateSchema } from "../schema/setting.schema";
import api from "../constants/api";
import client from "./axios.service";

export const getSettings = async () => {
  const { data } = await client.get<ISettingResponse>(api.SETTINGS);
  return data;
};

export const updateSetting = async (key: string, body: ISettingUpdateSchema) => {
  const { data } = await client.put(api.SETTING(key), body);
  return data;
};
