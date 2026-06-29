import axios from 'axios';

const api = axios.create({ baseURL: '/movimentacoes' });

async function listar(produtoId = 0, tipo = '') {
  const { data } = await api.get('/', { params: { produto_id: produtoId, tipo } });
  return data;
}

async function registrarEntrada(produtoId, quantidade, data) {
  const { data: res } = await api.post('/entrada', { produto_id: produtoId, quantidade, data });
  return res;
}

async function registrarSaida(produtoId, quantidade, data) {
  const { data: res } = await api.post('/saida', { produto_id: produtoId, quantidade, data });
  return res;
}

export default { listar, registrarEntrada, registrarSaida };
