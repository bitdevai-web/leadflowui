import {
  BrevoEvent,
  IEMailHistoryResponse,
  IEmailInboxResponse,
} from "../types/types";

import api from "../constants/api";
import client from "./axios.service";

export const getEmailHistory = async (params: {
  page: number;
  per_page: number;
  status: BrevoEvent | "";
}) => {
  const payload = await client.get<IEMailHistoryResponse>(api.SENT_EMAILS, {
    params,
  });
  return payload.data;
};

export const deleteEmailHistory = async (id: number) => {
  const payload = await client.delete(api.DELETE_EMAIL(id));
  return payload.data;
};

export const getEmailInbox = async (params: {
  page: number;
  per_page: number;
  reply_for_id: string;
  from_: string;
}): Promise<IEmailInboxResponse> => {
  const payload = await client.get<IEmailInboxResponse>(api.EMAIL_INBOX, {
    params,
  });
  return payload.data;
};
