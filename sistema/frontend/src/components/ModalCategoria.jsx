import { useState, useEffect } from 'react';

export default function ModalCategoria({ categoria, aoSalvar, aoFechar }) {
  const [nome, setNome]           = useState('');
  const [descricao, setDescricao] = useState('');
  const [erro, setErro]           = useState('');

  useEffect(() => {
    if (categoria) {
      setNome(categoria.nome);
      setDescricao(categoria.descricao || '');
    }
  }, [categoria]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    try {
      await aoSalvar(nome, descricao || null);
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao salvar categoria.');
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-bold text-blue-800 mb-4">
          {categoria ? 'Editar Categoria' : 'Nova Categoria'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              maxLength={60}
              value={nome}
              onChange={e => setNome(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex.: Laticínios"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              maxLength={200}
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Descrição opcional..."
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
