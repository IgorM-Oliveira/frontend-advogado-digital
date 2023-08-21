import axios from "axios";

const baseURL = "http://localhost:8080";

const useAxios = () => {
  const token = localStorage.getItem("authTokens")

  const axiosInstance = axios.create({
    baseURL,
  });

  axiosInstance.interceptors.request.use(
      config => {
        config.headers.Authorization = `Bearer ${token}`
        return Promise.resolve(config)
      },
      error => {
        return error
      },
  )

  return axiosInstance;
};

export default useAxios;