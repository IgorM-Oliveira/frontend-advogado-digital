import useAxios from '../utils/useAxios';
// eslint-disable-next-line react-hooks/rules-of-hooks
const api = useAxios();

export const getProcessos = async () => {
    const { data } = await api.get(`/processos`);
    return data;
};

export const getProcessosVinculados = async (id) => {
    const { data } = await api.get(`/processos/vinculados/${id}`);
    return data;
};

export const getTiposProcessos = async () => {
    const { data } = await api.get(`/processos/tipos`);
    return data;
};

export const getProcessosById = async (id) => {
    const { data } = await api.get(`/processos/${id}`);
    return data;
};

export const createProcessos = async (data) =>
    await api.post('/processos', data);

export const editProcessos = async (id, data) =>
    await api.put(`/processos/${id}`, data);

export const deleteProcessos = async (id) =>
    await api.delete(`/processos/${id}`);

export const uploadProcessosRemove = async (id, data) =>
    await api.post(`/processos/upload/remove/${id}`, data);

export const uploadProcessos = async (id, data) => {
    let result = null
    for (const file of data) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post(`/processos/upload/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            result = response.data;
        } catch (error) {
            throw error;
        }
    }
    return result
};