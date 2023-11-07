import axios from "axios";

const baseURL = "https://www.spdo.ms.gov.br/DiarioDOE/Index/Index/1";

const diarioAxios = () => {
    try {
        return axios.create({
            baseURL,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': 'https://www.spdo.ms.gov.br'
            },
        });
    } catch (e) {

    }
};

export default diarioAxios;