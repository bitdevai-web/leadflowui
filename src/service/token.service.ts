export const getAuthToken = () => localStorage.getItem("authtoken") ?? "";
export const setAuthToken = (token: string) =>
  localStorage.setItem("authtoken", token);
export const clearAuthToken = () => localStorage.clear();
