import axios from 'axios';

const api = axios.create({ baseURL: '/produtos' });

async function listar(filtro = '', categoriaId = 0) {
  const { data } = await api.get('/', { params: { nome: filtro, categoria_id: categoriaId } });
  return data;
}

async function buscarPorId(id) {
  const { data } = await api.get(`/${id}`);
  return data;
}

async function cadastrar(payload) {
  const { data } = await api.post('/', payload);
  return data;
}

async function atualizar(id, payload) {
  const { data } = await api.put(`/${id}`, payload);
  return data;
}

async function excluir(id) {
  await api.delete(`/${id}`);
}

export default { listar, buscarPorId, cadastrar, atualizar, excluir };
