import axios from "axios";

export const getDiarioOficial = async (data, filter) => {
    try {
        const form = new FormData();
        
        form.append('Filter.Numero', '');
        form.append('Filter.DataInicial', '10/10/2023');
        form.append('Filter.DataFinal', '10/10/2023');
        form.append('Filter.Texto', 790079362023);
        form.append('Filter.TipoBuscaEnum', 1);
        
        const response = await axios.post('/processos/getDiarioOficial', form);
        
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};