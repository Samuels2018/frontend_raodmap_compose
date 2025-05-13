import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import QuizApp from '../../src/pages/QuizApp/QuizApp'

describe('QuizApp', () => {
  beforeEach(() => {
    // Mock del timer
    vi.useFakeTimers()
  })

  afterEach(() => {
    // Restaurar timers reales
    vi.useRealTimers()
  })

  it('renderiza la pantalla de inicio correctamente', () => {
    render(<QuizApp />)
    expect(screen.getByText(/Welcome to the Quiz App/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Start Quiz/i })).toBeInTheDocument()
  })

  it('inicia el quiz al hacer clic en el botón Start', () => {
    render(<QuizApp />)
    fireEvent.click(screen.getByRole('button', { name: /Start Quiz/i }))
    
    expect(screen.getByText(/What is the capital of France\?/i)).toBeInTheDocument()
    expect(screen.queryByText(/Welcome to the Quiz App/i)).not.toBeInTheDocument()
  })

  it('muestra la primera pregunta con opciones y temporizador', () => {
    render(<QuizApp />)
    fireEvent.click(screen.getByRole('button', { name: /Start Quiz/i }))
    
    expect(screen.getByText(/What is the capital of France\?/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /London/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Paris/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Berlin/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Madrid/i })).toBeInTheDocument()
    expect(screen.getByText(/Question 60/i)).toBeInTheDocument()
  })

  it('avanza a la siguiente pregunta al seleccionar una respuesta', () => {
    render(<QuizApp />)
    fireEvent.click(screen.getByRole('button', { name: /Start Quiz/i }))
    
    // Responder primera pregunta correctamente
    fireEvent.click(screen.getByRole('button', { name: /Paris/i }))
    
    // Verificar segunda pregunta
    expect(screen.getByText(/What is the capital of France\?/i)).toBeInTheDocument()
    expect(screen.getByText(/Question 60/i)).toBeInTheDocument()
  })

  it('incrementa el puntaje al responder correctamente', () => {
    render(<QuizApp />)
    fireEvent.click(screen.getByRole('button', { name: /Start Quiz/i }))
    
    // Responder primera pregunta correctamente
    fireEvent.click(screen.getByRole('button', { name: /Paris/i }))
    
    // Responder segunda pregunta correctamente
    fireEvent.click(screen.getByRole('button', { name: /Madrid/i }))
    
    // Responder tercera pregunta incorrectamente
    fireEvent.click(screen.getByRole('button', { name: /Berlin/i }))
    
    // Completar el quiz
    fireEvent.click(screen.getByRole('button', { name: /Berlin/i }))
    fireEvent.click(screen.getByRole('button', { name: /London/i }))
    
    // Verificar puntaje (2 correctas, 1 incorrecta)
    expect(screen.getByText(/Correct! Well done./i)).toBeInTheDocument()
  })

  it('muestra la pantalla de resultados al completar todas las preguntas', () => {
    render(<QuizApp />)
    fireEvent.click(screen.getByRole('button', { name: /Start Quiz/i }))
    
    // Responder todas las preguntas
    fireEvent.click(screen.getByRole('button', { name: /Paris/i }))
    fireEvent.click(screen.getByRole('button', { name: /Berlin/i }))
    fireEvent.click(screen.getByRole('button', { name: /London/i }))
    fireEvent.click(screen.getByRole('button', { name: /Madrid/i }))
    fireEvent.click(screen.getByRole('button', { name: /Paris/i }))
    
    // Verificar pantalla de resultados
    expect(screen.getByText(/Correct! Well done./i)).toBeInTheDocument()
  })


  it('decrementa el tiempo y pasa a la siguiente pregunta cuando se acaba', () => {
    render(<QuizApp />)
    fireEvent.click(screen.getByRole('button', { name: /Start Quiz/i }))
    
    // Avanzar el tiempo 60 segundos
    act(() => {
      vi.advanceTimersByTime(60000)
    })
    
    // Debería haber pasado a la siguiente pregunta
    expect(screen.getByText(/Which planet is known as the Red Planet\?/i)).toBeInTheDocument()
    expect(screen.getByText(/Question 60/i)).toBeInTheDocument()
  })

  it('decrementa el puntaje cuando se acaba el tiempo', () => {
    render(<QuizApp />)
    fireEvent.click(screen.getByRole('button', { name: /Start Quiz/i }))
    
    // Avanzar el tiempo 60 segundos (se acaba el tiempo)
    act(() => {
      vi.advanceTimersByTime(60000)
    })
    
    // Responder el resto normalmente
    fireEvent.click(screen.getByRole('button', { name: /Venus/i })) // Correcta
    fireEvent.click(screen.getByRole('button', { name: /Mars/i })) // Incorrecta
    fireEvent.click(screen.getByRole('button', { name: /Jupiter/i })) // Correcta
    fireEvent.click(screen.getByRole('button', { name: /Saturn/i })) // Incorrecta
    fireEvent.click(screen.getByRole('button', { name: /Mars/i })) // Correcta
    
    // Verificar puntaje (se decrementó 1 por tiempo agotado)
    expect(screen.getByText(/The correct answer is:/i)).toBeInTheDocument()
  })
})