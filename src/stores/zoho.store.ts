import { atomWithStorage, createJSONStorage } from "jotai/utils";

import { useAtom } from "jotai/react";

/**
 * ZOHO Token Store
 */
export type ZohoTokenStore = {
  access_token: string;
  refresh_token: string;
};
const storage = createJSONStorage<ZohoTokenStore | null>(() => localStorage);
const zohoTokenAtom = atomWithStorage<ZohoTokenStore | null>(
  "zoho_token",
  null,
  storage
);

export const useZohoToken = () => useAtom(zohoTokenAtom);
