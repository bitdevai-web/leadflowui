import {
  EmailGenerationResponse,
  EmailVerificationResponse,
  ExecutionResponse,
  IEmailResponse,
  IEmailSchedule,
  IEmailStatusResponse,
  ILeadDeleteResponse,
  ILeadResponse,
  IStatResponse,
  LeadGenerateResponse,
  Pagination,
  TagResponse,
  ZohoExportResponse,
} from "../types/types";
import { LeadFilterSchema, LeadGenerationSchema } from "../schema/lead.schema";
import { MutationFunction, QueryFunction } from "@tanstack/react-query";

import api from "../constants/api";
import client from "./axios.service";

export const getLeads = async (params: Pagination & LeadFilterSchema) => {
  const response = await client.get<ILeadResponse>(api.GET_LEADS, {
    params,
  });

  return response.data;
};

export const getTags: QueryFunction<TagResponse> = async () => {
  const response = await client.get<TagResponse>(api.GET_TAGS);

  return response.data;
};

export const generateLead: MutationFunction<
  LeadGenerateResponse,
  Array<LeadGenerationSchema>
> = async (data) => {
  const response = await client.post<LeadGenerateResponse>(
    api.GENERATE_LEADS,
    data
  );
  return response.data;
};

export const generateEmail: MutationFunction<
  LeadGenerateResponse,
  Array<string>
> = async (data) => {
  const response = await client.post<LeadGenerateResponse>(
    api.GENERATE_EMAIL,
    data
  );
  return response.data;
};


export const generateEmailByLead: MutationFunction<
  EmailGenerationResponse,
  string
> = async (id) => {
  const response = await client.post(
    api.GENERATE_EMAIL_BY_LEAD(id),
  );
  return response.data;
};



export const getEmail = async (id: string) => {
  const response = await client.get<IEmailResponse>(api.GET_EMAIL + id);
  return response.data;
};
export const updateEmail = async (
  id: number,
  data: { subject: string; body: string }
) => {
  const response = await client.put<{ message: "OK" }>(
    api.GET_EMAIL + id,
    data
  );
  return response.data;
};
export const deleteLead: MutationFunction<ILeadDeleteResponse, string> = async (
  id
) => {
  const response = await client.delete(`${api.GET_LEADS}/${id}`);
  return response.data;
};

export const verifyEmail: MutationFunction<
  EmailVerificationResponse,
  string[]
> = async (data) => {
  const response = await client.post(api.EMAIL_VERIFICATION, data);
  return response.data;
};
export const getExecution = async (key: string) => {
  const id = localStorage.getItem(key);
  if (!id) {
    return { status: "", id: 0, created_at: "" };
  }
  const response = await client.get<ExecutionResponse>(
    api.GET_EXECUTION + Number(id)
  );

  return response.data.data;
};

export const scheduleEmail = async (data: IEmailSchedule[]) => {
  const response = await client.post<{ status: boolean }>(
    api.EMAIL_SCHEDULE,
    data
  );
  return response.data;
};

export const getEmailStatus = async (id: string) => {
  const response = await client.get<IEmailStatusResponse>(
    api.EMAIL_STATUS + id
  );
  return response.data;
};

export const getLeadStats = async () => {
  const response = await client.get<IStatResponse>(api.LEAD_STATS);
  return response.data.data;
};

export const exportLeadZoho = async (body: {
  refresh_token: string;
  lead_ids: string[];
}) => {
  const response = await client.post<ZohoExportResponse>(api.ZOHO_EXPORT, body);
  return response.data;
};
