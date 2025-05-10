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

  /*return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            GitHub <span className="text-emerald-600">Random</span> Repository Finder
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre repositorios aleatorios por lenguaje de programación
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10">
          <div className="relative w-full sm:w-auto">
            <select
              value={language}
              onChange={handleLanguageChange}
              disabled={loading}
              className="block w-full sm:w-64 px-4 py-3 text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50 appearance-none bg-white pr-10"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ease-in-out flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCcw className="h-5 w-5 animate-spin" />
                <span>Cargando...</span>
              </>
            ) : (
              <>
                <RefreshCcw className="h-5 w-5" />
                <span>Refrescar</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-white shadow-lg overflow-hidden rounded-xl border border-gray-100">
          {loading && (
            <div className="p-10 text-center">
              <div className="flex justify-center">
                <RefreshCcw className="h-12 w-12 text-emerald-600 animate-spin" />
              </div>
              <p className="mt-6 text-gray-600 font-medium">Buscando repositorios...</p>
            </div>
          )}

          {error && (
            <div className="p-8 text-center">
              <div className="flex justify-center text-red-500 mb-4">
                <AlertCircle className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold text-red-600 mb-3">Error</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={handleRefresh}
                className="px-5 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                Intentar nuevamente
              </button>
            </div>
          )}

          {!loading && !error && repository && (
            <div className="p-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <img
                    className="h-14 w-14 rounded-full ring-2 ring-emerald-100 p-1"
                    src={repository.owner.avatar_url || "/placeholder.svg"}
                    alt={`Avatar de ${repository.owner.login}`}
                  />
                </div>
                <div className="ml-5">
                  <h2 className="text-2xl font-bold text-gray-900 hover:text-emerald-600 transition-colors duration-200">
                    <a
                      href={repository.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      {repository.full_name}
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Creado por{" "}
                    <a
                      href={repository.owner.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:underline font-medium"
                    >
                      {repository.owner.login}
                    </a>
                  </p>
                </div>
              </div>

              <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-gray-700">{repository.description || "No hay descripción disponible."}</p>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 transition-all duration-200 hover:shadow-md hover:border-emerald-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <p className="text-sm font-medium text-gray-500">Estrellas</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{repository.stargazers_count.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 transition-all duration-200 hover:shadow-md hover:border-emerald-100">
                  <div className="flex items-center gap-2 mb-2">
                    <GitFork className="h-5 w-5 text-blue-500" />
                    <p className="text-sm font-medium text-gray-500">Forks</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{repository.forks_count.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 transition-all duration-200 hover:shadow-md hover:border-emerald-100">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <p className="text-sm font-medium text-gray-500">Issues abiertos</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{repository.open_issues_count.toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-4 items-center">
                  {repository.language && (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                      <Code className="h-4 w-4 mr-1.5" />
                      {repository.language}
                    </span>
                  )}
                  <span className="text-sm text-gray-500 flex items-center">
                    <svg className="h-4 w-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Creado: {new Date(repository.created_at).toLocaleDateString()}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center">
                    <svg className="h-4 w-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Actualizado: {new Date(repository.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && !repository && (
            <div className="p-10 text-center">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-4 text-xl font-medium text-gray-900">No se encontraron repositorios</h3>
              <p className="mt-2 text-gray-500">No hay repositorios disponibles para el lenguaje seleccionado.</p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Usando la API de GitHub - Página {page}
          </p>
        </div>
      </div>
    </div>
  )*/

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