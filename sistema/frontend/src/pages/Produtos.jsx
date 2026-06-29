import { useState, useEffect, useCallback } from 'react';
import produtoService from '../services/produtoService';
import categoriaService from '../services/categoriaService';
import ModalProduto from '../components/ModalProduto';

function statusProduto(produto) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  if (produto.data_validade) {
    const validade = new Date(produto.data_validade);
    if (validade < hoje) return { label: 'Vencido', cor: 'text-red-600 font-semibold' };
    const em7Dias = new Date(hoje);
    em7Dias.setDate(em7Dias.getDate() + 7);
    if (validade <= em7Dias) return { label: 'Vence em breve', cor: 'text-yellow-600 font-semibold' };
  }

  if (Number(produto.saldo) <= produto.estoque_minimo)
    return { label: 'Estoque baixo', cor: 'text-orange-600 font-semibold' };

  return { label: 'Normal', cor: 'text-green-600' };
}

export default function Produtos() {
  const [produtos, setProdutos]               = useState([]);
  const [categorias, setCategorias]           = useState([]);
  const [filtroNome, setFiltroNome]           = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState(0);
  const [modalAberto, setModalAberto]         = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [mensagem, setMensagem]               = useState(null);
  const [isCarregando, setIsCarregando]       = useState(false);

  const carregarProdutos = useCallback(async () => {
    setIsCarregando(true);
    try {
      const dados = await produtoService.listar(filtroNome, filtroCategoria);
      setProdutos(dados);
    } finally {
      setIsCarregando(false);
    }
  }, [filtroNome, filtroCategoria]);

  useEffect(() => {
    categoriaService.listar().then(setCategorias);
  }, []);

  useEffect(() => {
    carregarProdutos();
  }, [carregarProdutos]);

  function exibirMensagem(texto, tipo = 'sucesso') {
    setMensagem({ texto, tipo });
    setTimeout(() => setMensagem(null), 4000);
  }

  function abrirModalNovo() {
    setProdutoEditando(null);
    setModalAberto(true);
  }

  function abrirModalEditar(produto) {
    setProdutoEditando(produto);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setProdutoEditando(null);
  }

  async function salvarProduto(payload) {
    if (produtoEditando) {
      await produtoService.atualizar(produtoEditando.id, payload);
      exibirMensagem('Produto atualizado com sucesso.');
    } else {
      await produtoService.cadastrar(payload);
      exibirMensagem('Produto cadastrado com sucesso.');
    }
    fecharModal();
    carregarProdutos();
  }

  async function excluirProduto(id, nome) {
    const confirmou = window.confirm(`Deseja excluir o produto "${nome}"?\nO histórico de movimentações será preservado.`);
    if (!confirmou) return;

    try {
      await produtoService.excluir(id);
      exibirMensagem('Produto excluído com sucesso.');
      carregarProdutos();
    } catch (err) {
      exibirMensagem(err.response?.data?.erro || 'Erro ao excluir produto.', 'erro');
    }
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-blue-800">Produtos</h2>
        <button
          onClick={abrirModalNovo}
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 text-sm font-medium"
        >
          + Novo Produto
        </button>
      </div>

      {mensagem && (
        <div className={`mb-4 px-4 py-3 rounded text-sm border ${
          mensagem.tipo === 'erro'
            ? 'bg-red-50 border-red-200 text-red-700'
            : 'bg-green-50 border-green-200 text-green-700'
        }`}>
          {mensagem.texto}
        </div>
      )}

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          value={filtroNome}
          onChange={e => setFiltroNome(e.target.value)}
          placeholder="Buscar por nome..."
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filtroCategoria}
          onChange={e => setFiltroCategoria(Number(e.target.value))}
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={0}>Todas as categorias</option>
          {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isCarregando ? (
          <p className="text-center text-gray-400 py-10 text-sm">Carregando...</p>
        ) : produtos.length === 0 ? (
          <p className="text-center text-gray-400 py-10 text-sm">Nenhum produto encontrado.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-blue-800 text-white">
              <tr>
                <th className="px-4 py-3 text-left w-12">#</th>
                <th className="px-4 py-3 text-left">Nome</th>
                <th className="px-4 py-3 text-left">Categoria</th>
                <th className="px-4 py-3 text-center">Saldo</th>
                <th className="px-4 py-3 text-center">Un.</th>
                <th className="px-4 py-3 text-center">Validade</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center w-28">Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((p, idx) => {
                const st = statusProduto(p);
                return (
                  <tr key={p.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 text-gray-500">{p.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{p.nome}</td>
                    <td className="px-4 py-3 text-gray-600">{p.categoria_nome}</td>
                    <td className="px-4 py-3 text-center text-gray-700">{p.saldo}</td>
                    <td className="px-4 py-3 text-center text-gray-500">{p.unidade}</td>
                    <td className="px-4 py-3 text-center text-gray-500">
                      {p.data_validade ? new Date(p.data_validade).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '—'}
                    </td>
                    <td className={`px-4 py-3 text-center ${st.cor}`}>{st.label}</td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <button
                        onClick={() => abrirModalEditar(p)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => excluirProduto(p.id, p.nome)}
                        className="text-red-500 hover:text-red-700 font-medium"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {modalAberto && (
        <ModalProduto
          produto={produtoEditando}
          aoSalvar={salvarProduto}
          aoFechar={fecharModal}
        />
      )}
    </section>
  );
}
