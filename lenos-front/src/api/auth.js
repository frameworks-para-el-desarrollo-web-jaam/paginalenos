import axios from "axios";
import { API_URL } from "../config/api";

const authConfig = {
  withCredentials: true,
};

export const registerRequest = (user) => axios.post(`${API_URL}/register`, user, authConfig);

export const loginRequest = (user) => axios.post(`${API_URL}/login`, user, authConfig);
