import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER as string,
  withCredentials: false,
});

export default axiosInstance;