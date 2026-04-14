import {
  BrevoEvent,
  IEMailHistory,
  IEmailInbox,
  ILead,
  ISender,
  TagResponse
} from "../types/types";

// ─── Tags ────────────────────────────────────────────────────────────────────
export const MOCK_TAGS: TagResponse = {
  tag_tech: {
    _id: "tag_tech",
    category: null,
    cleaned_name: "Technology",
    created_at: "2024-01-01",
    display_order: 1,
    kind: "industry",
    num_organizations: 320,
    num_people: 5000,
    origination: "apollo",
    parent_tag_id: null,
    random: 0.5,
    uid: null,
    updated_at: "2024-01-01",
    id: "tag_tech",
    key: "technology",
  },
  tag_fin: {
    _id: "tag_fin",
    category: null,
    cleaned_name: "Finance",
    created_at: "2024-01-01",
    display_order: 2,
    kind: "industry",
    num_organizations: 210,
    num_people: 3200,
    origination: "apollo",
    parent_tag_id: null,
    random: 0.4,
    uid: null,
    updated_at: "2024-01-01",
    id: "tag_fin",
    key: "finance",
  },
  tag_health: {
    _id: "tag_health",
    category: null,
    cleaned_name: "Healthcare",
    created_at: "2024-01-01",
    display_order: 3,
    kind: "industry",
    num_organizations: 180,
    num_people: 2700,
    origination: "apollo",
    parent_tag_id: null,
    random: 0.3,
    uid: null,
    updated_at: "2024-01-01",
    id: "tag_health",
    key: "healthcare",
  },
  tag_retail: {
    _id: "tag_retail",
    category: null,
    cleaned_name: "Retail",
    created_at: "2024-01-01",
    display_order: 4,
    kind: "industry",
    num_organizations: 150,
    num_people: 2100,
    origination: "apollo",
    parent_tag_id: null,
    random: 0.2,
    uid: null,
    updated_at: "2024-01-01",
    id: "tag_retail",
    key: "retail",
  },
};

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export const MOCK_STATS: any = {
  status: true,
  message: "OK",
  total_leads: 0,
  total_senders: 0,
  total_emails: 0,
  total_responses: 0,
  country_wise_leads: {
    "United States": 0,
    India: 0,
    "United Kingdom": 0,
    Germany: 0,
    Australia: 0,
    Canada: 0,
  },
  status_wise_emails: {
    [BrevoEvent.DELIVERED]: 0,
    [BrevoEvent.UNIQUE_OPENED]: 0,
    [BrevoEvent.CLICKED]: 0,
    [BrevoEvent.SENT]: 0,
    [BrevoEvent.SOFT_BOUNCE]: 0,
    [BrevoEvent.HARD_BOUNCE]: 0,
    [BrevoEvent.SPAM]: 0,
    [BrevoEvent.UNSUBSCRIBED]: 0,
  } as Record<string, number>,
  quality_leads: [
    { category: "tag_tech", country: "United States", leads: 0 },
    { category: "tag_tech", country: "India", leads: 0 },
    { category: "tag_tech", country: "United Kingdom", leads: 0 },
    { category: "tag_fin", country: "United States", leads: 0 },
    { category: "tag_fin", country: "Germany", leads: 0 },
    { category: "tag_fin", country: "Australia", leads: 0 },
    { category: "tag_health", country: "United States", leads: 0 },
    { category: "tag_health", country: "Canada", leads: 0 },
    { category: "tag_retail", country: "India", leads: 0 },
    { category: "tag_retail", country: "United Kingdom", leads: 0 },
  ],
};

// ─── Senders ──────────────────────────────────────────────────────────────────
export const MOCK_SENDERS: ISender[] = [];

// ─── Leads (shared base) ──────────────────────────────────────────────────────

export const MOCK_RAW_LEADS: ILead[] = [];

export const MOCK_SENT_LEADS: ILead[] = [];

export const MOCK_RESPONDED_LEADS: ILead[] = [];

// ─── Sent Emails ──────────────────────────────────────────────────────────────
export const MOCK_SENT_EMAILS: IEMailHistory[] = [];

// ─── Inbox Emails ─────────────────────────────────────────────────────────────
export const MOCK_INBOX_EMAILS: IEmailInbox[] = [];
