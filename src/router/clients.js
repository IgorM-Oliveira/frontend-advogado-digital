import useAxios from '../utils/useAxios';
// eslint-disable-next-line react-hooks/rules-of-hooks
const api = useAxios();

export const getClient = async () => {
    const { data } = await api.get(`/clientes`);
    return data;
};

export const getClientById = async (id) => {
    const { data } = await api.get(`/clientes/${id}`);
    return data;
};

export const createClient = async (data) =>
    await api.post('/clientes', data);

export const editClient = async (id, data) =>
    await api.put(`/clientes/${id}`, data);

export const deleteClient = async (id) =>
    await api.delete(`/clientes/${id}`);