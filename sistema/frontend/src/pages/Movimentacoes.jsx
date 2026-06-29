import { useState, useEffect, useCallback } from 'react';
import movimentacaoService from '../services/movimentacaoService';
import produtoService from '../services/produtoService';
import ModalMovimentacao from '../components/ModalMovimentacao';

export default function Movimentacoes() {
  const [movimentacoes, setMovimentacoes]   = useState([]);
  const [produtos, setProdutos]             = useState([]);
  const [filtroProduto, setFiltroProduto]   = useState(0);
  const [filtroTipo, setFiltroTipo]         = useState('');
  const [modalTipo, setModalTipo]           = useState(null);
  const [mensagem, setMensagem]             = useState(null);
  const [isCarregando, setIsCarregando]     = useState(false);

  const carregarMovimentacoes = useCallback(async () => {
    setIsCarregando(true);
    try {
      const dados = await movimentacaoService.listar(filtroProduto, filtroTipo);
      setMovimentacoes(dados);
    } finally {
      setIsCarregando(false);
    }
  }, [filtroProduto, filtroTipo]);

  useEffect(() => {
    produtoService.listar().then(setProdutos);
  }, []);

  useEffect(() => {
    carregarMovimentacoes();
  }, [carregarMovimentacoes]);

  function exibirMensagem(texto, tipo = 'sucesso') {
    setMensagem({ texto, tipo });
    setTimeout(() => setMensagem(null), 4000);
  }

  async function salvarMovimentacao(produtoId, quantidade, data) {
    if (modalTipo === 'Entrada') {
      await movimentacaoService.registrarEntrada(produtoId, quantidade, data);
      exibirMensagem('Entrada registrada com sucesso.');
    } else {
      await movimentacaoService.registrarSaida(produtoId, quantidade, data);
      exibirMensagem('Saída registrada com sucesso.');
    }
    setModalTipo(null);
    carregarMovimentacoes();
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-blue-800">Movimentações</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setModalTipo('Entrada')}
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 text-sm font-medium"
          >
            + Entrada
          </button>
          <button
            onClick={() => setModalTipo('Saida')}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm font-medium"
          >
            − Saída
          </button>
        </div>
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
        <select
          value={filtroProduto}
          onChange={e => setFiltroProduto(Number(e.target.value))}
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={0}>Todos os produtos</option>
          {produtos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
        </select>
        <select
          value={filtroTipo}
          onChange={e => setFiltroTipo(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os tipos</option>
          <option value="Entrada">Entrada</option>
          <option value="Saida">Saída</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isCarregando ? (
          <p className="text-center text-gray-400 py-10 text-sm">Carregando...</p>
        ) : movimentacoes.length === 0 ? (
          <p className="text-center text-gray-400 py-10 text-sm">Nenhuma movimentação encontrada.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-blue-800 text-white">
              <tr>
                <th className="px-4 py-3 text-left w-12">#</th>
                <th className="px-4 py-3 text-left">Produto</th>
                <th className="px-4 py-3 text-center">Tipo</th>
                <th className="px-4 py-3 text-center">Qtd.</th>
                <th className="px-4 py-3 text-center">Data</th>
                <th className="px-4 py-3 text-left">Usuário</th>
              </tr>
            </thead>
            <tbody>
              {movimentacoes.map((m, idx) => (
                <tr key={m.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 text-gray-500">{m.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {m.produto_nome}
                    <span className="ml-1 text-gray-400 text-xs">({m.produto_unidade})</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      m.tipo === 'Entrada'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {m.tipo}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-700">{m.quantidade}</td>
                  <td className="px-4 py-3 text-center text-gray-500">
                    {new Date(m.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{m.usuario_nome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalTipo && (
        <ModalMovimentacao
          tipo={modalTipo}
          aoSalvar={salvarMovimentacao}
          aoFechar={() => setModalTipo(null)}
        />
      )}
    </section>
  );
}
