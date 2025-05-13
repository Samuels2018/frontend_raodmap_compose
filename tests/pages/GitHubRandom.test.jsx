import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import GitHubRandomPage from '../../src/pages/GitHubRandom/GitHubRandom'

// Mock de fetch global
global.fetch = vi.fn()

describe('GitHubRandomPage', () => {
  const mockRepository = {
    id: 123,
    full_name: 'test/repo',
    html_url: 'https://github.com/test/repo',
    owner: {
      login: 'testuser',
      html_url: 'https://github.com/testuser',
      avatar_url: 'https://avatar.url'
    },
    description: 'A test repository',
    stargazers_count: 100,
    forks_count: 50,
    open_issues_count: 10,
    language: 'JavaScript',
    created_at: '2020-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  }

  const mockInitialResponse = {
    total_count: 1000,
    items: []
  }

  const mockSearchResponse = {
    items: [mockRepository]
  }

  beforeEach(() => {
    // Resetear todos los mocks antes de cada test
    vi.resetAllMocks()

    // Configurar mock para la primera llamada (conteo total)
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockInitialResponse)
    })

    // Configurar mock para la segunda llamada (búsqueda)
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSearchResponse)
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renderiza correctamente el título y descripción', () => {
    render(<GitHubRandomPage />)
    
    expect(screen.getByText('GitHub Random Repository Finder')).toBeInTheDocument()
    expect(screen.getByText('Descubre repositorios aleatorios por lenguaje de programación')).toBeInTheDocument()
  })

  it('muestra el selector de lenguaje con opciones', () => {
    render(<GitHubRandomPage />)
    
    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
    expect(select.value).toBe('javascript')
    
    // Verificar algunas opciones
    expect(screen.getByText('Javascript')).toBeInTheDocument()
    expect(screen.getByText('Python')).toBeInTheDocument()
    expect(screen.getByText('Java')).toBeInTheDocument()
  })

  it('muestra el botón de refrescar', async() => {
    render(<GitHubRandomPage />)
    
    await waitFor(() => {
      const button = screen.getByRole('button', { name: /refrescar|loading/i })
      expect(button).toBeInTheDocument()
      expect(button).toBeEnabled()
    })
  })

  it('cambia el lenguaje cuando se selecciona una opción diferente', () => {
    render(<GitHubRandomPage />)
    
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'python' } })
    
    expect(select.value).toBe('python')
  })

  it('muestra un estado de carga cuando se hace clic en refrescar', async () => {
    render(<GitHubRandomPage />)
    
    await waitFor(() => {
      const button = screen.getByRole('button', { name: /refrescar/i })
      fireEvent.click(button)
      
      expect(screen.getByText('Cargando...')).toBeInTheDocument()
      expect(fetch).toHaveBeenCalledTimes(8)
    })
  })

  it('muestra un repositorio cuando la API responde correctamente', async () => {
    render(<GitHubRandomPage />)
    
    await waitFor(() => {
      expect(screen.getByText(mockRepository.full_name)).toBeInTheDocument()
      expect(screen.getByText(mockRepository.description)).toBeInTheDocument()
      expect(screen.getByText(`⭐ Estrellas`)).toBeInTheDocument()
      expect(screen.getByText(mockRepository.stargazers_count.toString())).toBeInTheDocument()
    })
  })

  it('muestra un mensaje de error cuando la API falla', async () => {
    fetch.mockReset()
    fetch.mockRejectedValueOnce(new Error('API error'))
    
    render(<GitHubRandomPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument()
      expect(screen.getByText('API error')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /intentar nuevamente/i })).toBeInTheDocument()
    })
  })

  it('muestra un mensaje cuando no hay repositorios', async () => {
    fetch.mockReset()
    // Mock para la primera llamada (conteo total)
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockInitialResponse)
    })
    // Mock para la segunda llamada (búsqueda) con items vacíos
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ items: [] })
    })
    
    render(<GitHubRandomPage />)
    
    await waitFor(() => {
      expect(screen.getByText('No se encontraron repositorios')).toBeInTheDocument()
      expect(screen.getByText('No hay repositorios disponibles para el lenguaje seleccionado.')).toBeInTheDocument()
    })
  })

  it('permite reintentar cuando hay un error', async () => {
   // Limpiar mocks anteriores
    fetch.mockReset();
    
    // Primera llamada falla (conteo inicial)
    fetch.mockRejectedValueOnce(new Error('API error'));
    // Segunda llamada (después de reintentar) tiene éxito (conteo)
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockInitialResponse)
    });
    // Tercera llamada (después de reintentar) tiene éxito (búsqueda)
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSearchResponse)
    });

    render(<GitHubRandomPage />);
    
    // Esperar a que aparezca el error - buscamos por rol y texto
    const errorHeading = await screen.findByRole('heading', { 
      name: /error/i,
      level: 3 
    });
    expect(errorHeading).toBeInTheDocument();
    
    // También verificamos que el mensaje de error esté presente
    expect(screen.getByText('API error')).toBeInTheDocument();
    
    // Hacer clic en reintentar
    const retryButton = screen.getByRole('button', { 
      name: /intentar nuevamente/i 
    });
    fireEvent.click(retryButton);
    
    // Verificar que se muestra el loading
    expect(screen.getByText(/cargando.../i)).toBeInTheDocument();
    
    // Esperar a que aparezca el repositorio
    await waitFor(() => {
      expect(screen.getByText(mockRepository.full_name)).toBeInTheDocument();
    });
  })
})