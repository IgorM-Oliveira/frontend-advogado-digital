import axios from "axios";

const baseURL = "http://localhost:8080";

const useAxios = () => {
    try {
        const token = localStorage.getItem("authTokens")
        const newString = token.replace('"', "");

        const axiosInstance = axios.create({
            baseURL,
        });

        axiosInstance.interceptors.request.use(
            config => {
                config.headers.Authorization = `Bearer ${newString.replace('"', "")}`
                return Promise.resolve(config)
            },
            error => {
                return error
            },
        )

        return axiosInstance;
    } catch (e) {

    }
};

export default useAxios;