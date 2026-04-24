export interface ILoginResponse {
  data: IUser;
  status: boolean;
  message: string;
}

export interface IProfileResponse {
  data: IUser;
  status: boolean;
  message: string;
}

export interface IUser {
  password: string;
  first_name: string;
  last_name: string;
  created_at: string;
  id: number;
  email: string;
  token: string;
}

export interface ILeadResponse {
  status: boolean;
  message: string;
  total: number;
  per_page: number;
  page: number;
  data: ILead[];
}

export interface ILead {
  id: string;
  last_name: string;
  category: string;
  company: string;
  created_at: string;
  email: string;
  email_verified: VerificationStatus;
  first_name: string;
  designation: string;
  country: string;
  timezone: string;
  is_sent: boolean;
  is_responded: boolean;
  emails: IEmail[];
}
export type TagResponse = Record<string, ITag>;

export interface ITag {
  _id: string;
  category: any;
  cleaned_name: string;
  created_at: string;
  display_order: number;
  kind: string;
  num_organizations: number;
  num_people: number;
  origination: string;
  parent_tag_id: any;
  random: number;
  uid: any;
  updated_at: string;
  id: string;
  key: string;
}
export type LeadGenerateResponse = {
  message: string;
  status: boolean;
  data: {
    id: number;
  };
};
export type EmailGenerationResponse = {
  message: string;
  status: boolean;
  time: number;
};
export type ExecutionResponse = {
  data: {
    status: string;
    id: number;
    created_at: string;
  };
  status: boolean;
  message: string;
};
export type Pagination = {
  page: number;
  per_page: number;
};

export interface ISearchResponse {
  status: boolean;
  message: string;
  data: ISearchTerm[];
  total: number;
}

export interface ISearchTerm {
  id: number;
  title: string;
  created_at: string;
  industry_name: string;
  country: string;
  industry: string;
}

export interface ISearchTermCreateResponse {
  status: boolean;
  message: string;
  data: ISearchResponse;
}
export enum VerificationStatus {
  PENDING,
  SUCCESS,
  FAILED,
  BLOCKED,
}
export interface ILeadDeleteResponse {
  status: boolean;
  message: string;
}
export type EmailVerificationResponse = {
  message: string;
  status: boolean;
  data: {
    id: number;
  };
};
export interface IEmailResponse {
  message: string;
  status: boolean;
  data: IEmail[];
}

export interface IEmail {
  id: number;
  subject: string;
  body: string;
  lead_id: string;
}
export interface IEmailSchedule {
  lead_id: string;
  sender_id: number;
  subject: string;
  body: string;
  scheduled_time_min: string;
  scheduled_time_max: string;
  current_index: number;
}
export interface IEmailStatusResponse {
  status: boolean;
  message: string;
  data: IEMailHistory[];
}

export interface ICreateSenderResponse {
  message: string;
  status: boolean;
  data: ISender;
}

export interface ISender {
  name: string;
  email: string;
  created_at: string;
  ending: string;
  designation: string;
  id: number;
  updated_at: string;
}
export interface ISenderResponse {
  message: string;
  status: boolean;
  total: number;
  per_page: number;
  page: number;
  data: ISender[];
}

export enum BrevoEvent {
  SENT = "request",
  DELIVERED = "delivered",
  UNIQUE_OPENED = "unique_opened",
  OPENED = "opened",
  PROXY_OPEN = "proxy_open",
  CLICKED = "click",
  SOFT_BOUNCE = "soft_bounce",
  HARD_BOUNCE = "hard_bounce",
  INVALID_EMAIL = "invalid_email",
  ERROR = "error",
  DEFERRED = "deferred",
  SPAM = "spam",
  UNSUBSCRIBED = "unsubscribed",
  BLOCKED = "blocked",
  SCHEDULED = "SCHEDULED",
  SENT_TO_BREVO = "SENT",
  FAILED = "FAILED",
  UNIQUE_PROXY_OPEN = "unique_proxy_open",
  UNIQUE_CLICKED = "unique_clicked",
}
export interface IEMailHistoryResponse {
  status: string;
  data: IEMailHistory[];
  total: number;
  per_page: number;
  page: number;
}

export interface IEMailHistory {
  id: number;
  body: string;
  current_index: number;
  scheduled_time_max: string;
  message_id: any;
  lead_id: string;
  subject: string;
  status: BrevoEvent;
  scheduled_time_min: string;
  created_at: string;
  sender_id?: number;
  sender: ISender | null;
  lead: ILead | null;
}

export interface IEmailInboxResponse {
  status: string;
  data: IEmailInbox[];
  total: number;
  per_page: number;
  page: number;
}

export interface IEmailInbox {
  from_: string;
  message_id: string;
  time: string;
  html: string;
  reply_for_id: string;
  subject: string;
  id: number;
  to: string;
  body: string;
  sender: null | ISender;
}

export interface IStatResponse {
  status: boolean;
  message: string;
  data: IStatData;
}

export interface IStatData {
  total_leads: number;
  total_emails: number;
  total_responses: number;
  country_wise_leads: CountryWiseLeads;
  total_senders: number;
  status_wise_emails: StatusWiseEmails;
  quality_leads: IQualityLead[];
}

export interface IQualityLead {
  category: string;
  country: string;
  leads: number;
}

export interface CountryWiseLeads {
  [x: string]: number;
}

export type StatusWiseEmails = Record<BrevoEvent, number>;

export interface ISetting {
  key: string;
  value: string;
  description: string | null;
}

export interface ISettingResponse {
  data: ISetting[];
}

export type ZohoExportResponse = {
  message: string;
  status: boolean;
  data: {
    id: number;
  };
};
