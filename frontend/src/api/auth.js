import axios from "axios";

const BASE_URL = "http://localhost:5000/api/auth";

export const loginAPI = (username, password) => {
  return axios.post(`${BASE_URL}/login`, { username, password });
};

export const registerAPI = (username, password) => {
  return axios.post(`${BASE_URL}/register`, { username, password });
};
