import axios from "axios";
import { getAuthToken } from "./token.service";

const client = axios.create();
client.interceptors.request.use((config) => {
  config.headers.Authorization = getAuthToken();
  return config;
});
export default client;
