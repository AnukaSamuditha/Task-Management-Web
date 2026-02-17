import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER as string,
  withCredentials: true,
});

export default axiosInstance;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh"
    ) {
      originalRequest._retry = true;
      try {
        await axiosInstance.post("/auth/refresh");

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refreshing failed : ", refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
