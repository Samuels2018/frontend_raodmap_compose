import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RedisclientPage from '../../src/pages/RedditClient/RedditClient'

// Mock de localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString() },
    removeItem: (key) => { delete store[key] },
    clear: () => { store = {} }
  }
})()

// Mock de fetch
global.fetch = vi.fn()

describe('RedisclientPage', () => {
  beforeEach(() => {
    // Configurar mocks antes de cada test
    global.localStorage = localStorageMock
    localStorage.clear()
    fetch.mockReset()
  })

  it('renderiza correctamente el título y estado inicial', () => {
    render(<RedisclientPage />)
    
    expect(screen.getByText('Reddit Client')).toBeInTheDocument()
    expect(screen.getByText('No subreddits added yet. Add one to get started!')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('subreddit')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Add Subreddit/i })).toBeInTheDocument()
  })

  it('carga lanes guardadas desde localStorage', () => {
    const mockLanes = [{ subreddit: 'reactjs', posts: [], loading: false, error: null }]
    localStorage.setItem('redditLanes', JSON.stringify(mockLanes))
    
    render(<RedisclientPage />)
    
    expect(screen.getByText('r/reactjs')).toBeInTheDocument()
    expect(screen.queryByText('No subreddits added yet')).not.toBeInTheDocument()
  })

  it('muestra error cuando se intenta agregar un subreddit duplicado', async () => {
    const mockLanes = [{ subreddit: 'reactjs', posts: [], loading: false, error: null }]
    localStorage.setItem('redditLanes', JSON.stringify(mockLanes))
    
    render(<RedisclientPage />)
    
    const input = screen.getByPlaceholderText('subreddit')
    const button = screen.getByRole('button', { name: /Add Subreddit/i })
    
    fireEvent.change(input, { target: { value: 'reactjs' } })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText('Subreddit "reactjs" already exists')).toBeInTheDocument()
    })
  })

  it('agrega un nuevo lane cuando el subreddit es válido', async () => {
    const mockResponse = {
      data: {
        children: [
          { data: { title: 'Post 1' } },
          { data: { title: 'Post 2' } }
        ]
      }
    }
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    })
    
    render(<RedisclientPage />)
    
    const input = screen.getByPlaceholderText('subreddit')
    const button = screen.getByRole('button', { name: /Add Subreddit/i })
    
    fireEvent.change(input, { target: { value: 'javascript' } })
    fireEvent.click(button)
    
    // Verificar estado de carga
    expect(screen.getByRole('button', { name: /Adding.../i })).toBeDisabled()
    
    await waitFor(() => {
      expect(screen.getByText('r/javascript')).toBeInTheDocument()
      expect(screen.queryByText('No subreddits added yet')).not.toBeInTheDocument()
      expect(localStorage.getItem('redditLanes')).toContain('javascript')
    })
  })

  it('muestra error cuando el subreddit no existe', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({})
    })
    
    render(<RedisclientPage />)
    
    const input = screen.getByPlaceholderText('subreddit')
    const button = screen.getByRole('button', { name: /Add Subreddit/i })
    
    fireEvent.change(input, { target: { value: 'invalid-subreddit' } })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText('Subreddit "invalid-subreddit" not found')).toBeInTheDocument()
    })
  })

  it('elimina un lane correctamente', async () => {
    const mockLanes = [
      { subreddit: 'reactjs', posts: [], loading: false, error: null },
      { subreddit: 'javascript', posts: [], loading: false, error: null }
    ]
    localStorage.setItem('redditLanes', JSON.stringify(mockLanes))
    
    render(<RedisclientPage />)
    
    // Eliminar el primer lane
    const removeButtons = screen.getAllByRole('button', { name: /Remove/i })
    fireEvent.click(removeButtons[0])
    
    await waitFor(() => {
      expect(screen.queryByText('r/reactjs')).not.toBeInTheDocument()
      expect(screen.getByText('r/javascript')).toBeInTheDocument()
      expect(JSON.parse(localStorage.getItem('redditLanes'))).toHaveLength(1)
    })
  })

  it('actualiza un lane correctamente', async () => {
    const mockLanes = [{ subreddit: 'reactjs', posts: [], loading: false, error: null }]
    localStorage.setItem('redditLanes', JSON.stringify(mockLanes))
    
    const mockResponse = {
      data: {
        children: [
          { data: { title: 'New Post 1' } },
          { data: { title: 'New Post 2' } }
        ]
      }
    }
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    })
    
    render(<RedisclientPage />)
    
    // Hacer clic en el botón de actualizar
    const refreshButton = screen.getByRole('button', { name: /Refresh/i })
    fireEvent.click(refreshButton)
    
    // Verificar estado de carga
    expect(refreshButton).toBeDisabled()
    
    await waitFor(() => {
      expect(refreshButton).toBeEnabled()
      expect(localStorage.getItem('redditLanes')).toContain('New Post 1')
    })
  })

  it('muestra error cuando falla la actualización de un lane', async () => {
    const mockLanes = [{ subreddit: 'reactjs', posts: [], loading: false, error: null }]
    localStorage.setItem('redditLanes', JSON.stringify(mockLanes))
    
    fetch.mockRejectedValueOnce(new Error('Failed to refresh'))
    
    render(<RedisclientPage />)
    
    const refreshButton = screen.getByRole('button', { name: /Refresh/i })
    fireEvent.click(refreshButton)
    
    await waitFor(() => {
      expect(screen.getByText('Failed to refresh')).toBeInTheDocument()
    })
  })

  it('guarda los lanes en localStorage cuando cambian', async () => {
    const mockResponse = {
      data: {
        children: [
          { data: { title: 'Post 1' } }
        ]
      }
    }
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    })
    
    render(<RedisclientPage />)
    
    // Agregar un lane
    const input = screen.getByPlaceholderText('subreddit')
    const button = screen.getByRole('button', { name: /Add Subreddit/i })
    
    fireEvent.change(input, { target: { value: 'testing' } })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(localStorage.getItem('redditLanes')).toContain('testing')
    })
    
    // Eliminar el lane
    const removeButton = screen.getByRole('button', { name: /Remove/i })
    fireEvent.click(removeButton)
    
    await waitFor(() => {
      expect(localStorage.getItem('redditLanes')).not.toContain('testing')
    })
  })
})