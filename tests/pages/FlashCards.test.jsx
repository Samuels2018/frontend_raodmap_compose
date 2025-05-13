import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FlashCardsPage from '../../src/pages/FlashCards/FlashCards'

describe('FlashCardsPage', () => {
  it('renderiza correctamente el título y la estructura principal', () => {
    render(<FlashCardsPage />)
    
    expect(screen.getByText('Flash Cards de JavaScript')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Anterior' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Siguiente' })).toBeInTheDocument()
  })

  it('muestra la primera tarjeta al inicio', () => {
    render(<FlashCardsPage />)
    
    expect(screen.getByText('¿Cuál es el idioma más hablado del mundo?')).toBeInTheDocument()
    expect(screen.queryByText(/El chino mandarín con aproximadamente/)).not.toBeInTheDocument()
  })

  it('permite navegar entre tarjetas con los botones', () => {
    render(<FlashCardsPage />)
    
    // Ir a la siguiente tarjeta
    fireEvent.click(screen.getByText('Siguiente'))
    expect(screen.getByText('¿Qué significa \'lengua romance\'?')).toBeInTheDocument()
    
    // Volver a la anterior
    fireEvent.click(screen.getByText('Anterior'))
    expect(screen.getByText('¿Cuál es el idioma más hablado del mundo?')).toBeInTheDocument()
    
    // Circular al final de la lista
    for (let i = 0; i < 9; i++) {
      fireEvent.click(screen.getByText('Siguiente'))
    }
    expect(screen.getByText('¿Qué es el efecto de lengua puente?')).toBeInTheDocument()
    
    // Circular al principio de la lista
    fireEvent.click(screen.getByText('Siguiente'))
    expect(screen.getByText('¿Cuál es el idioma más hablado del mundo?')).toBeInTheDocument()
  })

  it('permite voltear la tarjeta para ver la respuesta', () => {
    render(<FlashCardsPage />)
    
    // La respuesta no debería estar visible inicialmente
    expect(screen.queryByText(/El chino mandarín con aproximadamente/)).not.toBeInTheDocument()
    
    // Voltear la tarjeta
    const card = screen.getByText('¿Cuál es el idioma más hablado del mundo?').closest('div')
    fireEvent.click(card)
    
    // La respuesta debería estar visible después de voltear
    expect(screen.getByText(/El chino mandarín con aproximadamente/)).toBeInTheDocument()
    
    // Voltear de nuevo para ocultar la respuesta
    fireEvent.click(card)
    expect(screen.queryByText(/El chino mandarín con aproximadamente/)).not.toBeInTheDocument()
  })

  it('muestra el progreso correctamente', () => {
    render(<FlashCardsPage />)
    
    // Verificar progreso inicial (1/10)

    expect(screen.getByText('Tarjeta 1 de 10')).toBeInTheDocument()
    
    // Avanzar y verificar progreso (2/10)
    fireEvent.click(screen.getByText('Siguiente'))
    expect(screen.getByText('Tarjeta 2 de 10')).toBeInTheDocument()
    
    // Retroceder y verificar progreso (1/10)
    fireEvent.click(screen.getByText('Anterior'))
    expect(screen.getByText('Tarjeta 1 de 10')).toBeInTheDocument()
  })

  it('reinicia el estado de volteo al cambiar de tarjeta', () => {
    render(<FlashCardsPage />)
    
    // Voltear la tarjeta actual
    const card = screen.getByText('¿Cuál es el idioma más hablado del mundo?').closest('div')
    fireEvent.click(card)
    expect(screen.getByText(/El chino mandarín con aproximadamente/)).toBeInTheDocument()
    
    // Cambiar a la siguiente tarjeta
    fireEvent.click(screen.getByText('Siguiente'))
    
    // La nueva tarjeta no debería estar volteada
    expect(screen.getByText('¿Qué significa \'lengua romance\'?')).toBeInTheDocument()
    expect(screen.queryByText(/Son idiomas que derivan del latín vulgar/)).not.toBeInTheDocument()
  })

  it('maneja correctamente el borde de la lista de tarjetas', () => {
    render(<FlashCardsPage />)
    
    // Ir a la última tarjeta
    for (let i = 0; i < 9; i++) {
      fireEvent.click(screen.getByText('Siguiente'))
    }
    expect(screen.getByText('¿Qué es el efecto de lengua puente?')).toBeInTheDocument()
    
    // Avanzar debería volver al inicio
    fireEvent.click(screen.getByText('Siguiente'))
    expect(screen.getByText('¿Cuál es el idioma más hablado del mundo?')).toBeInTheDocument()
    
    // Retroceder desde la primera debería ir al final
    fireEvent.click(screen.getByText('Anterior'))
    expect(screen.getByText('¿Qué es el efecto de lengua puente?')).toBeInTheDocument()
  })
})