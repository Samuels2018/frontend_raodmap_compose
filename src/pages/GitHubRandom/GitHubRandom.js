import React, { useState, useEffect } from 'react';

function App() {
  const [language, setLanguage] = useState('javascript');
  const [repository, setRepository] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const languages = [
    'javascript',
    'python',
    'java',
    'typescript',
    'c#',
    'php',
    'c++',
    'go',
    'ruby',
    'swift',
    'kotlin',
    'rust'
  ];

  const fetchRandomRepository = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Primero obtenemos el conteo total de repositorios
      const initialResponse = await fetch(
        `https://api.github.com/search/repositories?q=language:${language}&sort=stars&order=desc&per_page=1`
      );
      
      if (!initialResponse.ok) {
        throw new Error('Error al obtener datos de GitHub');
      }
      
      const initialData = await initialResponse.json();
      const totalRepos = initialData.total_count;
      
      // Calculamos una página aleatoria (GitHub permite máximo 1000 resultados)
      const maxPage = Math.min(Math.ceil(totalRepos / 30), 33);
      const randomPage = Math.floor(Math.random() * maxPage) + 1;
      
      // Obtenemos una página aleatoria de resultados
      const response = await fetch(
        `https://api.github.com/search/repositories?q=language:${language}&sort=stars&order=desc&page=${randomPage}&per_page=30`
      );
      
      if (!response.ok) {
        throw new Error('Error al obtener repositorios');
      }
      
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        // Seleccionamos un repositorio aleatorio de la página
        const randomIndex = Math.floor(Math.random() * data.items.length);
        setRepository(data.items[randomIndex]);
        setPage(randomPage);
      } else {
        setRepository(null);
      }
    } catch (err) {
      setError(err.message);
      setRepository(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomRepository();
  }, [language]);

  const handleRefresh = () => {
    fetchRandomRepository();
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            GitHub Random Repository Finder
          </h1>
          <p className="text-lg text-gray-600">
            Descubre repositorios aleatorios por lenguaje de programación
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
          <select
            value={language}
            onChange={handleLanguageChange}
            disabled={loading}
            className="block w-full sm:w-auto px-4 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:opacity-50"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
          
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Cargando...
              </span>
            ) : (
              'Refrescar'
            )}
          </button>
        </div>
        
        <div className="bg-white shadow overflow-hidden rounded-lg">
          {loading && (
            <div className="p-8 text-center">
              <div className="flex justify-center">
                <svg className="animate-spin h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="mt-4 text-gray-600">Buscando repositorios...</p>
            </div>
          )}
          
          {error && (
            <div className="p-6 text-center">
              <div className="flex justify-center text-red-500 mb-4">
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-red-600 mb-2">Error</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Intentar nuevamente
              </button>
            </div>
          )}
          
          {!loading && !error && repository && (
            <div className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <img className="h-10 w-10 rounded-full" src={repository.owner.avatar_url} alt="Avatar" />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold text-gray-900 hover:text-green-600">
                    <a href={repository.html_url} target="_blank" rel="noopener noreferrer">
                      {repository.full_name}
                    </a>
                  </h2>
                  <p className="text-sm text-gray-500">
                    Creado por <a href={repository.owner.html_url} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">{repository.owner.login}</a>
                  </p>
                </div>
              </div>
              
              <p className="mt-4 text-gray-600">
                {repository.description || 'No hay descripción disponible.'}
              </p>
              
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">⭐ Estrellas</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{repository.stargazers_count}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">🍴 Forks</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{repository.forks_count}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">⚠️ Issues abiertos</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{repository.open_issues_count}</p>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  {repository.language && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {repository.language}
                    </span>
                  )}
                  <span>📅 Creado: {new Date(repository.created_at).toLocaleDateString()}</span>
                  <span>🔄 Actualizado: {new Date(repository.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}
          
          {!loading && !error && !repository && (
            <div className="p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No se encontraron repositorios</h3>
              <p className="mt-1 text-gray-500">No hay repositorios disponibles para el lenguaje seleccionado.</p>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Usando la API de GitHub - Página {page}</p>
        </div>
      </div>
    </div>
  );
}

export default App;