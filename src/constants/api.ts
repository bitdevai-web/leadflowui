import { ZOHO_CLIENT_ID } from "./env";

const BASE_URL = getBase();

export default {
  BASE_URL,
  LOGIN: `${BASE_URL}/auth/login`,
  PROFILE: `${BASE_URL}/auth/me`,
  GET_LEADS: `${BASE_URL}/leads`,
  GENERATE_LEADS: `${BASE_URL}/leads/generate`,
  GENERATE_EMAIL: `${BASE_URL}/leads/generate/email`,
  GENERATE_EMAIL_BY_LEAD: (id: string) => `${BASE_URL}/leads/generate/email/${id}`,
  GET_EMAIL: `${BASE_URL}/leads/emails/`,
  GET_TAGS: `${BASE_URL}/tags`,
  GET_EXECUTION: `${BASE_URL}/execution/status/`,
  SEARCH_TERM: `${BASE_URL}/search`,
  EMAIL_VERIFICATION: `${BASE_URL}/verify/email`,
  EMAIL_SCHEDULE: `${BASE_URL}/leads/emails/schedule`,
  EMAIL_STATUS: `${BASE_URL}/leads/email-status/`,
  SENDERS: `${BASE_URL}/senders`,
  SENDER: (id: number) => `${BASE_URL}/senders/${id}`,
  SENT_EMAILS: `${BASE_URL}/emails`,
  DELETE_EMAIL: (id: number) => `${BASE_URL}/emails/${id}`,
  EMAIL_INBOX: `${BASE_URL}/inbox`,
  LEAD_STATS: `${BASE_URL}/leads/stats`,
  ZOHO_TOKEN: `${BASE_URL}/auth/zoho`,
  ZOHO_EXPORT: `${BASE_URL}/leads/export/zoho`,
  ZOHO_AUTH: `https://accounts.zoho.com/oauth/v2/auth?scope=AaaServer.profile.Read,ZohoCRM.modules.ALL&client_id=${ZOHO_CLIENT_ID}&response_type=code&access_type=offline&redirect_uri=${getAuthRedirectionUrl()}`,
  SETTINGS: `${BASE_URL}/settings`,
  SETTING: (key: string) => `${BASE_URL}/settings/${key}`,
};

function getBase() {
  const hostname = window.location.hostname;
  return `https://pyhost.mydevfactory.com/leadflow/api/v1`
  if (hostname.includes("localhost")) {
    return "http://localhost:8000/api/v1";
  } else if (hostname.includes("staging")) {
    return `https://pyhost.mydevfactory.com/leadflow-stag/api/v1`;
  } else {
    return `https://pyhost.mydevfactory.com/leadflow/api/v1`;
  }
}
function getAuthRedirectionUrl() {
  const { host, protocol } = window.location;
  return `${protocol}//${host}/auth/zoho`;
}
