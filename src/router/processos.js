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