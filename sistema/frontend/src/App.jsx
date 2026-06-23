import Categorias from './pages/Categorias';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-800 text-white px-6 py-4 shadow">
        <h1 className="text-xl font-bold">Guardião da Cozinha</h1>
      </header>
      <main className="max-w-4xl mx-auto p-6">
        <Categorias />
      </main>
    </div>
  );
}
