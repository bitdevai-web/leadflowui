import { ICreateSenderResponse, ISenderResponse } from "../types/types";

import { ISenderSchema } from "../schema/sender.schema";
import api from "../constants/api";
import client from "./axios.service";

export const getSenders = async (params: {
  per_page: number;
  page: number;
}) => {
  const { data } = await client.get<ISenderResponse>(api.SENDERS, {
    params,
  });
  return data;
};

export const createSender = async (data: ISenderSchema) => {
  const { data: res } = await client.post<ICreateSenderResponse>(
    api.SENDERS,
    data
  );
  return res.data;
};
export const updateSender = async (id: number, body: ISenderSchema) => {
  const { data } = await client.put<ICreateSenderResponse>(
    api.SENDER(id),
    body
  );
  return data.data;
};

export const deleteSender = async (id: number) => {
  const { data } = await client.delete<ICreateSenderResponse>(api.SENDER(id));
  return data.data;
};
