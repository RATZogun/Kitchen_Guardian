import { useState, useEffect, useCallback } from 'react';
import categoriaService from '../services/categoriaService';
import ModalCategoria from '../components/ModalCategoria';

export default function Categorias() {
  const [categorias, setCategorias]         = useState([]);
  const [filtro, setFiltro]                 = useState('');
  const [modalAberto, setModalAberto]       = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [mensagem, setMensagem]             = useState(null);
  const [isCarregando, setIsCarregando]     = useState(false);

  const carregarCategorias = useCallback(async () => {
    setIsCarregando(true);
    try {
      const dados = await categoriaService.listar(filtro);
      setCategorias(dados);
    } finally {
      setIsCarregando(false);
    }
  }, [filtro]);

  useEffect(() => {
    carregarCategorias();
  }, [carregarCategorias]);

  function exibirMensagem(texto, tipo = 'sucesso') {
    setMensagem({ texto, tipo });
    setTimeout(() => setMensagem(null), 4000);
  }

  function abrirModalNovo() {
    setCategoriaEditando(null);
    setModalAberto(true);
  }

  function abrirModalEditar(categoria) {
    setCategoriaEditando(categoria);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setCategoriaEditando(null);
  }

  async function salvarCategoria(nome, descricao) {
    if (categoriaEditando) {
      await categoriaService.atualizar(categoriaEditando.id, nome, descricao);
      exibirMensagem('Categoria atualizada com sucesso.');
    } else {
      await categoriaService.cadastrar(nome, descricao);
      exibirMensagem('Categoria cadastrada com sucesso.');
    }
    fecharModal();
    carregarCategorias();
  }

  async function excluirCategoria(id, nome) {
    const confirmou = window.confirm(`Deseja excluir a categoria "${nome}"?`);
    if (!confirmou) return;

    try {
      await categoriaService.excluir(id);
      exibirMensagem('Categoria excluída com sucesso.');
      carregarCategorias();
    } catch (err) {
      exibirMensagem(err.response?.data?.erro || 'Erro ao excluir categoria.', 'erro');
    }
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-blue-800">Categorias</h2>
        <button
          onClick={abrirModalNovo}
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 text-sm font-medium"
        >
          + Nova Categoria
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
        ) : categorias.length === 0 ? (
          <p className="text-center text-gray-400 py-10 text-sm">Nenhuma categoria encontrada.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-blue-800 text-white">
              <tr>
                <th className="px-4 py-3 text-left w-12">#</th>
                <th className="px-4 py-3 text-left">Nome</th>
                <th className="px-4 py-3 text-left">Descrição</th>
                <th className="px-4 py-3 text-center w-32">Ações</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((cat, idx) => (
                <tr key={cat.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 text-gray-500">{cat.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{cat.nome}</td>
                  <td className="px-4 py-3 text-gray-500">{cat.descricao || '—'}</td>
                  <td className="px-4 py-3 text-center space-x-2">
                    <button
                      onClick={() => abrirModalEditar(cat)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => excluirCategoria(cat.id, cat.nome)}
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
        <ModalCategoria
          categoria={categoriaEditando}
          aoSalvar={salvarCategoria}
          aoFechar={fecharModal}
        />
      )}
    </section>
  );
}
