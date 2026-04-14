import { IEMailHistory, IEmailInbox, ILead, ISender, IStatResponse, StatusWiseEmails, TagResponse } from "../types/types";

// ─── Tags ────────────────────────────────────────────────────────────────────
export const MOCK_TAGS: TagResponse = {};

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export const MOCK_STATS: IStatResponse = {
  status: true,
  message: "OK",
  data: {
    total_leads: 0,
    total_senders: 0,
    total_emails: 0,
    total_responses: 0,
    country_wise_leads: {},
    status_wise_emails: {} as StatusWiseEmails,
    quality_leads: [],
  },
};

// ─── Senders ──────────────────────────────────────────────────────────────────
export const MOCK_SENDERS: ISender[] = [];

export const MOCK_RAW_LEADS: ILead[] = [];

export const MOCK_SENT_LEADS: ILead[] = [];

export const MOCK_RESPONDED_LEADS: ILead[] = [];

// ─── Sent Emails ──────────────────────────────────────────────────────────────
export const MOCK_SENT_EMAILS: IEMailHistory[] = [];

// ─── Inbox Emails ─────────────────────────────────────────────────────────────
export const MOCK_INBOX_EMAILS: IEmailInbox[] = [];
