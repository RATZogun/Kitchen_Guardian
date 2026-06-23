import axios from 'axios';

const api = axios.create({ baseURL: '/categorias' });

async function listar(filtro = '') {
  const { data } = await api.get('/', { params: { nome: filtro } });
  return data;
}

async function buscarPorId(id) {
  const { data } = await api.get(`/${id}`);
  return data;
}

async function cadastrar(nome, descricao) {
  const { data } = await api.post('/', { nome, descricao });
  return data;
}

async function atualizar(id, nome, descricao) {
  const { data } = await api.put(`/${id}`, { nome, descricao });
  return data;
}

async function excluir(id) {
  await api.delete(`/${id}`);
}

export default { listar, buscarPorId, cadastrar, atualizar, excluir };
