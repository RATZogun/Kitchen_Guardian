import { useState, useEffect } from 'react';
import produtoService from '../services/produtoService';

export default function ModalMovimentacao({ tipo, aoSalvar, aoFechar }) {
  const [produtoId, setProdutoId] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [data, setData]           = useState(new Date().toISOString().slice(0, 10));
  const [produtos, setProdutos]   = useState([]);
  const [erro, setErro]           = useState('');

  useEffect(() => {
    produtoService.listar().then(setProdutos);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    try {
      await aoSalvar(Number(produtoId), Number(quantidade), data);
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao registrar movimentação.');
    }
  }

  const titulo = tipo === 'Entrada' ? 'Registrar Entrada' : 'Registrar Saída';
  const corBotao = tipo === 'Entrada'
    ? 'bg-green-700 hover:bg-green-800'
    : 'bg-red-600 hover:bg-red-700';

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-bold text-blue-800 mb-4">{titulo}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Produto <span className="text-red-500">*</span>
            </label>
            <select
              value={produtoId}
              onChange={e => setProdutoId(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione um produto</option>
              {produtos.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nome} — saldo: {p.saldo} {p.unidade}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantidade <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                value={quantidade}
                onChange={e => setQuantidade(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={data}
                max={new Date().toISOString().slice(0, 10)}
                onChange={e => setData(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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
            <button type="submit" className={`px-4 py-2 rounded text-white ${corBotao}`}>
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
