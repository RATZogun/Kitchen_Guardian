import axios from 'axios';

const api = axios.create({ baseURL: '/fornecedores' });

async function listar(filtro = '') {
  const { data } = await api.get('/', { params: { nome: filtro } });
  return data;
}

async function buscarPorId(id) {
  const { data } = await api.get(`/${id}`);
  return data;
}

async function cadastrar(nome, cnpj) {
  const { data } = await api.post('/', { nome, cnpj });
  return data;
}

async function atualizar(id, nome, cnpj) {
  const { data } = await api.put(`/${id}`, { nome, cnpj });
  return data;
}

async function excluir(id) {
  await api.delete(`/${id}`);
}

export default { listar, buscarPorId, cadastrar, atualizar, excluir };
