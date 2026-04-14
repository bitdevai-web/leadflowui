import { BrevoEvent, IEMailHistory, IEmailInbox, ILead, ISender, IStatResponse, TagResponse, VerificationStatus } from "../types/types";

// ─── Tags ────────────────────────────────────────────────────────────────────
export const MOCK_TAGS: TagResponse = {
  "tag_tech": { _id: "tag_tech", category: null, cleaned_name: "Technology", created_at: "2024-01-01", display_order: 1, kind: "industry", num_organizations: 320, num_people: 5000, origination: "apollo", parent_tag_id: null, random: 0.5, uid: null, updated_at: "2024-01-01", id: "tag_tech", key: "technology" },
  "tag_fin": { _id: "tag_fin", category: null, cleaned_name: "Finance", created_at: "2024-01-01", display_order: 2, kind: "industry", num_organizations: 210, num_people: 3200, origination: "apollo", parent_tag_id: null, random: 0.4, uid: null, updated_at: "2024-01-01", id: "tag_fin", key: "finance" },
  "tag_health": { _id: "tag_health", category: null, cleaned_name: "Healthcare", created_at: "2024-01-01", display_order: 3, kind: "industry", num_organizations: 180, num_people: 2700, origination: "apollo", parent_tag_id: null, random: 0.3, uid: null, updated_at: "2024-01-01", id: "tag_health", key: "healthcare" },
  "tag_retail": { _id: "tag_retail", category: null, cleaned_name: "Retail", created_at: "2024-01-01", display_order: 4, kind: "industry", num_organizations: 150, num_people: 2100, origination: "apollo", parent_tag_id: null, random: 0.2, uid: null, updated_at: "2024-01-01", id: "tag_retail", key: "retail" },
};

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export const MOCK_STATS: IStatResponse = {
  status: true,
  message: "OK",
  total_leads: 1842,
  total_senders: 7,
  total_emails: 3210,
  total_responses: 148,
  country_wise_leads: {
    "United States": 640,
    "India": 420,
    "United Kingdom": 280,
    "Germany": 195,
    "Australia": 160,
    "Canada": 147,
  },
  status_wise_emails: {
    [BrevoEvent.DELIVERED]: 1240,
    [BrevoEvent.UNIQUE_OPENED]: 876,
    [BrevoEvent.CLICKED]: 312,
    [BrevoEvent.SENT]: 508,
    [BrevoEvent.SOFT_BOUNCE]: 44,
    [BrevoEvent.HARD_BOUNCE]: 18,
    [BrevoEvent.SPAM]: 9,
    [BrevoEvent.UNSUBSCRIBED]: 23,
  } as Record<string, number>,
  quality_leads: [
    { category: "tag_tech", country: "United States", leads: 180 },
    { category: "tag_tech", country: "India", leads: 120 },
    { category: "tag_tech", country: "United Kingdom", leads: 80 },
    { category: "tag_fin", country: "United States", leads: 140 },
    { category: "tag_fin", country: "Germany", leads: 90 },
    { category: "tag_fin", country: "Australia", leads: 65 },
    { category: "tag_health", country: "United States", leads: 100 },
    { category: "tag_health", country: "Canada", leads: 75 },
    { category: "tag_retail", country: "India", leads: 95 },
    { category: "tag_retail", country: "United Kingdom", leads: 60 },
  ],
};

// ─── Senders ──────────────────────────────────────────────────────────────────
export const MOCK_SENDERS: ISender[] = [
  { id: 1, name: "Arjun Mehta", email: "arjun.mehta@leadflow.io", ending: "Best regards", designation: "Sales Executive", created_at: "2024-11-10T08:00:00", updated_at: "2025-01-15T10:30:00" },
  { id: 2, name: "Priya Sharma", email: "priya.sharma@leadflow.io", ending: "Warm regards", designation: "Business Development Manager", created_at: "2024-11-12T09:00:00", updated_at: "2025-02-01T11:00:00" },
  { id: 3, name: "Rahul Gupta", email: "rahul.gupta@leadflow.io", ending: "Cheers", designation: "Account Executive", created_at: "2024-11-20T10:00:00", updated_at: "2025-02-10T14:00:00" },
  { id: 4, name: "Sophie Williams", email: "sophie.w@leadflow.io", ending: "Kind regards", designation: "Senior Sales Manager", created_at: "2024-12-01T08:30:00", updated_at: "2025-03-01T09:00:00" },
  { id: 5, name: "David Chen", email: "david.chen@leadflow.io", ending: "Thanks", designation: "Growth Specialist", created_at: "2024-12-05T11:00:00", updated_at: "2025-03-10T16:00:00" },
  { id: 6, name: "Meera Nair", email: "meera.nair@leadflow.io", ending: "Sincerely", designation: "Outreach Coordinator", created_at: "2025-01-03T09:00:00", updated_at: "2025-03-20T10:00:00" },
  { id: 7, name: "James Okafor", email: "james.okafor@leadflow.io", ending: "Regards", designation: "Enterprise Sales", created_at: "2025-01-10T10:00:00", updated_at: "2025-04-01T12:00:00" },
];

// ─── Leads (shared base) ──────────────────────────────────────────────────────
const makeLead = (
  id: string, first: string, last: string, email: string,
  company: string, designation: string, country: string,
  category: string, verified: VerificationStatus,
  is_sent: boolean, is_responded: boolean,
  has_email: boolean
): ILead => ({
  id,
  first_name: first,
  last_name: last,
  email,
  company,
  designation,
  country,
  category,
  timezone: "UTC+5:30",
  email_verified: verified,
  is_sent,
  is_responded,
  created_at: "2025-03-10T08:00:00",
  emails: has_email ? [{ id: 1, subject: "Quick intro", body: "Hi, I'd love to connect...", lead_id: id }] : [],
});

export const MOCK_RAW_LEADS: ILead[] = [
  makeLead("l1","Rohan","Verma","rohan.verma@nextech.com","NexTech Inc.","CTO","India","tag_tech",VerificationStatus.SUCCESS,false,false,true),
  makeLead("l2","Emma","Johnson","emma.j@finbridge.co","FinBridge Co.","CFO","United States","tag_fin",VerificationStatus.SUCCESS,false,false,false),
  makeLead("l3","Luca","Rossi","luca.r@healthplus.it","HealthPlus","CMO","Germany","tag_health",VerificationStatus.PENDING,false,false,false),
  makeLead("l4","Aisha","Patel","aisha.p@retailhub.in","RetailHub","VP Operations","India","tag_retail",VerificationStatus.SUCCESS,false,false,true),
  makeLead("l5","James","Osei","james.o@techwave.gh","TechWave","CEO","United Kingdom","tag_tech",VerificationStatus.FAILED,false,false,false),
  makeLead("l6","Clara","Müller","clara.m@invest.de","InvestGroup","Director","Germany","tag_fin",VerificationStatus.SUCCESS,false,false,true),
  makeLead("l7","Yuki","Tanaka","yuki.t@medicore.jp","Medicore","Head of Sales","Australia","tag_health",VerificationStatus.PENDING,false,false,false),
  makeLead("l8","Samuel","Adeyemi","s.adeyemi@shopnow.ng","ShopNow","Marketing Lead","Canada","tag_retail",VerificationStatus.BLOCKED,false,false,false),
];

export const MOCK_SENT_LEADS: ILead[] = [
  makeLead("s1","Priya","Krishnan","priya.k@cloudbase.io","CloudBase","Head of Product","India","tag_tech",VerificationStatus.SUCCESS,true,false,true),
  makeLead("s2","Oliver","Brown","o.brown@capitalone.com","Capital One","VP Finance","United States","tag_fin",VerificationStatus.SUCCESS,true,false,true),
  makeLead("s3","Fatima","Al-Hassan","f.hassan@medilink.ae","MediLink","COO","United Kingdom","tag_health",VerificationStatus.SUCCESS,true,false,true),
  makeLead("s4","Carlos","Reyes","c.reyes@fastmart.mx","FastMart","Founder","Australia","tag_retail",VerificationStatus.SUCCESS,true,false,false),
  makeLead("s5","Nina","Kovač","nina.k@devops.si","DevOps Pro","CTO","Germany","tag_tech",VerificationStatus.SUCCESS,true,false,true),
  makeLead("s6","Hassan","Malik","h.malik@finvest.pk","FinVest","Managing Director","Canada","tag_fin",VerificationStatus.PENDING,true,false,false),
];

export const MOCK_RESPONDED_LEADS: ILead[] = [
  makeLead("r1","Ayesha","Siddiqui","ayesha.s@innovate.pk","InnovateTech","CEO","India","tag_tech",VerificationStatus.SUCCESS,true,true,true),
  makeLead("r2","Tom","Walker","t.walker@growthco.us","GrowthCo","Director of Sales","United States","tag_fin",VerificationStatus.SUCCESS,true,true,true),
  makeLead("r3","Akosua","Mensah","a.mensah@healthgen.gh","HealthGen","COO","United Kingdom","tag_health",VerificationStatus.SUCCESS,true,true,true),
  makeLead("r4","Diego","Hernández","d.hernandez@retailpro.mx","RetailPro","VP Sales","Australia","tag_retail",VerificationStatus.SUCCESS,true,true,true),
  makeLead("r5","Simone","Bianchi","s.bianchi@coretech.it","CoreTech","CTO","Germany","tag_tech",VerificationStatus.SUCCESS,true,true,true),
];

// ─── Sent Emails ──────────────────────────────────────────────────────────────
export const MOCK_SENT_EMAILS: IEMailHistory[] = [
  { id: 1, subject: "Quick intro from Arjun at LeadFlow", body: "<p>Hi Rohan,<br/>I'd love to connect...</p>", current_index: 0, scheduled_time_min: "09:00", scheduled_time_max: "11:00", message_id: "msg_001", lead_id: "l1", status: BrevoEvent.DELIVERED, scheduled_time_min: "09:00", scheduled_time_max: "11:00", created_at: "2025-04-10T09:30:00", sender_id: 1, sender: MOCK_SENDERS[0], lead: MOCK_SENT_LEADS[0] },
  { id: 2, subject: "Partnership opportunity for FinBridge", body: "<p>Hi Emma,<br/>Reaching out regarding a new partnership...</p>", current_index: 1, scheduled_time_min: "10:00", scheduled_time_max: "12:00", message_id: "msg_002", lead_id: "s1", status: BrevoEvent.UNIQUE_OPENED, created_at: "2025-04-10T10:00:00", sender_id: 2, sender: MOCK_SENDERS[1], lead: MOCK_SENT_LEADS[1] },
  { id: 3, subject: "Helping HealthPlus scale outreach", body: "<p>Hi Luca,<br/>We work with companies like yours...</p>", current_index: 0, scheduled_time_min: "11:00", scheduled_time_max: "13:00", message_id: null, lead_id: "s2", status: BrevoEvent.SENT_TO_BREVO, created_at: "2025-04-11T08:00:00", sender_id: 3, sender: MOCK_SENDERS[2], lead: MOCK_SENT_LEADS[2] },
  { id: 4, subject: "Retail automation insights", body: "<p>Hi Aisha,<br/>Based on your company profile...</p>", current_index: 2, scheduled_time_min: "08:00", scheduled_time_max: "10:00", message_id: "msg_004", lead_id: "s3", status: BrevoEvent.CLICKED, created_at: "2025-04-11T09:45:00", sender_id: 4, sender: MOCK_SENDERS[3], lead: MOCK_SENT_LEADS[3] },
  { id: 5, subject: "Growth opportunities in GH market", body: "<p>Hi James,<br/>I noticed TechWave is expanding...</p>", current_index: 0, scheduled_time_min: "14:00", scheduled_time_max: "16:00", message_id: null, lead_id: "s4", status: BrevoEvent.HARD_BOUNCE, created_at: "2025-04-12T10:00:00", sender_id: 1, sender: MOCK_SENDERS[0], lead: MOCK_SENT_LEADS[4] },
  { id: 6, subject: "Connecting with InvestGroup", body: "<p>Hi Clara,<br/>We specialize in B2B outreach automation...</p>", current_index: 1, scheduled_time_min: "09:00", scheduled_time_max: "11:00", message_id: "msg_006", lead_id: "s5", status: BrevoEvent.DELIVERED, created_at: "2025-04-12T11:30:00", sender_id: 2, sender: MOCK_SENDERS[1], lead: MOCK_SENT_LEADS[5] },
  { id: 7, subject: "Medicore sales outreach intro", body: "<p>Hi Yuki,<br/>Reaching out to explore synergies...</p>", current_index: 0, scheduled_time_min: "13:00", scheduled_time_max: "15:00", message_id: "msg_007", lead_id: "r1", status: BrevoEvent.OPENED, created_at: "2025-04-13T09:00:00", sender_id: 5, sender: MOCK_SENDERS[4], lead: MOCK_RESPONDED_LEADS[0] },
];

// ─── Inbox Emails ─────────────────────────────────────────────────────────────
export const MOCK_INBOX_EMAILS: IEmailInbox[] = [
  { id: 1, from_: "rohan.verma@nextech.com", to: "arjun.mehta@leadflow.io", subject: "Re: Quick intro from Arjun at LeadFlow", body: "Hi Arjun, thanks for reaching out! I'd be happy to hop on a call.", html: "<p>Hi Arjun, thanks for reaching out! I'd be happy to hop on a call.</p>", reply_for_id: "msg_001", message_id: "reply_001", time: "2025-04-10T14:22:00", sender: MOCK_SENDERS[0] },
  { id: 2, from_: "emma.j@finbridge.co", to: "priya.sharma@leadflow.io", subject: "Re: Partnership opportunity for FinBridge", body: "Thanks for the email. Can you share more details?", html: "<p>Thanks for the email. Can you share more details about pricing?</p>", reply_for_id: "msg_002", message_id: "reply_002", time: "2025-04-11T09:15:00", sender: MOCK_SENDERS[1] },
  { id: 3, from_: "aisha.p@retailhub.in", to: "sophie.w@leadflow.io", subject: "Re: Retail automation insights", body: "Very interesting! Let's schedule a demo.", html: "<p>Very interesting! Let's schedule a demo this week.</p>", reply_for_id: "msg_004", message_id: "reply_003", time: "2025-04-12T11:40:00", sender: MOCK_SENDERS[3] },
  { id: 4, from_: "clara.m@invest.de", to: "priya.sharma@leadflow.io", subject: "Re: Connecting with InvestGroup", body: "Hello, we might be interested. Please send us a proposal.", html: "<p>Hello, we might be interested. Please send us a formal proposal.</p>", reply_for_id: "msg_006", message_id: "reply_004", time: "2025-04-13T08:55:00", sender: MOCK_SENDERS[1] },
  { id: 5, from_: "yuki.t@medicore.jp", to: "david.chen@leadflow.io", subject: "Re: Medicore sales outreach intro", body: "Thanks David, looking forward to the conversation!", html: "<p>Thanks David, looking forward to the conversation next week!</p>", reply_for_id: "msg_007", message_id: "reply_005", time: "2025-04-13T13:10:00", sender: MOCK_SENDERS[4] },
];
