import { useState, useEffect, useCallback } from 'react';
import fornecedorService from '../services/fornecedorService';
import ModalFornecedor from '../components/ModalFornecedor';

export default function Fornecedores() {
  const [fornecedores, setFornecedores]           = useState([]);
  const [filtro, setFiltro]                       = useState('');
  const [modalAberto, setModalAberto]             = useState(false);
  const [fornecedorEditando, setFornecedorEditando] = useState(null);
  const [mensagem, setMensagem]                   = useState(null);
  const [isCarregando, setIsCarregando]           = useState(false);

  const carregarFornecedores = useCallback(async () => {
    setIsCarregando(true);
    try {
      const dados = await fornecedorService.listar(filtro);
      setFornecedores(dados);
    } finally {
      setIsCarregando(false);
    }
  }, [filtro]);

  useEffect(() => {
    carregarFornecedores();
  }, [carregarFornecedores]);

  function exibirMensagem(texto, tipo = 'sucesso') {
    setMensagem({ texto, tipo });
    setTimeout(() => setMensagem(null), 4000);
  }

  function abrirModalNovo() {
    setFornecedorEditando(null);
    setModalAberto(true);
  }

  function abrirModalEditar(fornecedor) {
    setFornecedorEditando(fornecedor);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setFornecedorEditando(null);
  }

  async function salvarFornecedor(nome, cnpj) {
    if (fornecedorEditando) {
      await fornecedorService.atualizar(fornecedorEditando.id, nome, cnpj);
      exibirMensagem('Fornecedor atualizado com sucesso.');
    } else {
      await fornecedorService.cadastrar(nome, cnpj);
      exibirMensagem('Fornecedor cadastrado com sucesso.');
    }
    fecharModal();
    carregarFornecedores();
  }

  async function excluirFornecedor(id, nome) {
    const confirmou = window.confirm(`Deseja excluir o fornecedor "${nome}"?`);
    if (!confirmou) return;

    try {
      await fornecedorService.excluir(id);
      exibirMensagem('Fornecedor excluído com sucesso.');
      carregarFornecedores();
    } catch (err) {
      exibirMensagem(err.response?.data?.erro || 'Erro ao excluir fornecedor.', 'erro');
    }
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-blue-800">Fornecedores</h2>
        <button
          onClick={abrirModalNovo}
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 text-sm font-medium"
        >
          + Novo Fornecedor
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

      <div className="mb-4">
        <input
          type="text"
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          placeholder="Buscar por nome..."
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isCarregando ? (
          <p className="text-center text-gray-400 py-10 text-sm">Carregando...</p>
        ) : fornecedores.length === 0 ? (
          <p className="text-center text-gray-400 py-10 text-sm">Nenhum fornecedor encontrado.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-blue-800 text-white">
              <tr>
                <th className="px-4 py-3 text-left w-12">#</th>
                <th className="px-4 py-3 text-left">Nome</th>
                <th className="px-4 py-3 text-left">CNPJ</th>
                <th className="px-4 py-3 text-center w-32">Ações</th>
              </tr>
            </thead>
            <tbody>
              {fornecedores.map((f, idx) => (
                <tr key={f.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 text-gray-500">{f.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{f.nome}</td>
                  <td className="px-4 py-3 text-gray-500">{f.cnpj || '—'}</td>
                  <td className="px-4 py-3 text-center space-x-2">
                    <button
                      onClick={() => abrirModalEditar(f)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => excluirFornecedor(f.id, f.nome)}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalAberto && (
        <ModalFornecedor
          fornecedor={fornecedorEditando}
          aoSalvar={salvarFornecedor}
          aoFechar={fecharModal}
        />
      )}
    </section>
  );
}
