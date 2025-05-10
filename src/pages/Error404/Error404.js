import {Link} from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="mx-auto flex w-full max-w-md flex-col items-center text-center">
        {/* SVG icon directly in the code */}
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-12 w-12 text-red-600"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M12 18v-6" />
            <path d="M12 9h.01" />
          </svg>
        </div>
        <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">404</h1>
        <h2 className="mb-6 text-2xl font-semibold text-gray-700">Página no encontrada</h2>
        <p className="mb-8 text-base text-gray-600">Lo sentimos, no pudimos encontrar la página que estás buscando.</p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md 
          bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-colors 
          hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 
          focus:ring-offset-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-400"
        >
          {/* Arrow left SVG directly in the code */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Volver al inicio
        </Link>
      </div>
      <div className="mt-12 text-center text-sm text-gray-500">
        ¿Necesitas ayuda?{" "}
        <a href="/contacto" className="font-medium text-gray-900 underline">
          Contáctanos
        </a>
      </div>
    </div>
  )
}

export default NotFoundPage