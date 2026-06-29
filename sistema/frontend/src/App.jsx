import { useState } from 'react';
import Categorias from './pages/Categorias';
import Fornecedores from './pages/Fornecedores';
import Produtos from './pages/Produtos';
import Movimentacoes from './pages/Movimentacoes';

const ABAS = [
  { id: 'categorias',    label: 'Categorias' },
  { id: 'fornecedores',  label: 'Fornecedores' },
  { id: 'produtos',      label: 'Produtos' },
  { id: 'movimentacoes', label: 'Movimentações' },
];

export default function App() {
  const [abaAtiva, setAbaAtiva] = useState('categorias');

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-800 text-white px-6 py-4 shadow">
        <h1 className="text-xl font-bold">Guardião da Cozinha</h1>
      </header>

      <nav className="bg-white border-b border-gray-200 px-6">
        <div className="max-w-5xl mx-auto flex gap-0">
          {ABAS.map(aba => (
            <button
              key={aba.id}
              onClick={() => setAbaAtiva(aba.id)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                abaAtiva === aba.id
                  ? 'border-blue-700 text-blue-700'
                  : 'border-transparent text-gray-500 hover:text-blue-600'
              }`}
            >
              {aba.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-6">
        {abaAtiva === 'categorias'    && <Categorias />}
        {abaAtiva === 'fornecedores'  && <Fornecedores />}
        {abaAtiva === 'produtos'      && <Produtos />}
        {abaAtiva === 'movimentacoes' && <Movimentacoes />}
      </main>
    </div>
  );
}
