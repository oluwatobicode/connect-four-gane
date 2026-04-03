import axios from "axios";

const baseUrl = "http://localhost:5000/api/v1";

export const apiInstance = axios.create({
  baseURL: baseUrl,

  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
