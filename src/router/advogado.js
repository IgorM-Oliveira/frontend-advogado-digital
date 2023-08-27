import useAxios from '../utils/useAxios';
// eslint-disable-next-line react-hooks/rules-of-hooks
const api = useAxios();

export const getAdvogado = async () => {
    const { data } = await api.get(`/advogados`);
    return data;
};

export const getAdvogadoById = async (id) => {
    const { data } = await api.get(`/advogados/${id}`);
    return data;
};

export const createAdvogado = async (data) =>
    await api.post('/advogados', data);

export const editAdvogado = async (id, data) =>
    await api.put(`/advogados/${id}`, data);

export const deleteAdvogado = async (id) =>
    await api.delete(`/advogados/${id}`);