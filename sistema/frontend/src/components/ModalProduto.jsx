import { useState, useEffect } from 'react';
import categoriaService from '../services/categoriaService';
import fornecedorService from '../services/fornecedorService';

const UNIDADES = ['un', 'kg', 'g', 'l', 'ml'];

export default function ModalProduto({ produto, aoSalvar, aoFechar }) {
  const [nome, setNome]                 = useState('');
  const [categoriaId, setCategoriaId]   = useState('');
  const [fornecedorId, setFornecedorId] = useState('');
  const [unidade, setUnidade]           = useState('un');
  const [estoqueMin, setEstoqueMin]     = useState(0);
  const [dataValidade, setDataValidade] = useState('');
  const [categorias, setCategorias]     = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [erro, setErro]                 = useState('');

  useEffect(() => {
    categoriaService.listar().then(setCategorias);
    fornecedorService.listar().then(setFornecedores);
  }, []);

  useEffect(() => {
    if (produto) {
      setNome(produto.nome);
      setCategoriaId(String(produto.categoria_id));
      setFornecedorId(produto.fornecedor_id ? String(produto.fornecedor_id) : '');
      setUnidade(produto.unidade);
      setEstoqueMin(produto.estoque_minimo);
      setDataValidade(produto.data_validade ? produto.data_validade.slice(0, 10) : '');
    }
  }, [produto]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    try {
      await aoSalvar({
        nome,
        categoria_id: Number(categoriaId),
        fornecedor_id: fornecedorId ? Number(fornecedorId) : null,
        unidade,
        estoque_minimo: Number(estoqueMin),
        data_validade: dataValidade || null,
      });
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao salvar produto.');
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
        <h2 className="text-lg font-bold text-blue-800 mb-4">
          {produto ? 'Editar Produto' : 'Novo Produto'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              maxLength={100}
              value={nome}
              onChange={e => setNome(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex.: Leite integral"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria <span className="text-red-500">*</span>
            </label>
            <select
              value={categoriaId}
              onChange={e => setCategoriaId(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione uma categoria</option>
              {categorias.map(c => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fornecedor
            </label>
            <select
              value={fornecedorId}
              onChange={e => setFornecedorId(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sem fornecedor</option>
              {fornecedores.map(f => (
                <option key={f.id} value={f.id}>{f.nome}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unidade <span className="text-red-500">*</span>
              </label>
              <select
                value={unidade}
                onChange={e => setUnidade(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {UNIDADES.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estoque mínimo
              </label>
              <input
                type="number"
                min={0}
                value={estoqueMin}
                onChange={e => setEstoqueMin(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de validade
            </label>
            <input
              type="date"
              value={dataValidade}
              onChange={e => setDataValidade(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {erro && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              {erro}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={aoFechar}
              className="px-4 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-700 text-white hover:bg-blue-800"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
