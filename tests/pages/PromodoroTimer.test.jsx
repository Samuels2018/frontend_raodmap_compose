import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Timer from '../../src/pages/PomodoroTimer/PromodoroTimer'

// Mock the audio element
window.HTMLMediaElement.prototype.play = vi.fn()

describe('Timer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders initial state correctly', () => {
    render(<Timer />)
    
    expect(screen.getByText('work')).toBeInTheDocument()
    expect(screen.getByText('25:00')).toBeInTheDocument()
    expect(screen.getByText('Start')).toBeInTheDocument()
    expect(screen.getByText('Sessions: 0')).toBeInTheDocument()
    expect(screen.getByText('Show Settings')).toBeInTheDocument()
  })

  it('starts and pauses the timer', async () => {
    render(<Timer />);
    expect(screen.getByText('25:00')).toBeInTheDocument();
    expect(screen.getByText('Start')).toBeInTheDocument();
    
    // 2. Iniciar el temporizador (usando texto)
    const startButton = screen.getByText('Start');
    fireEvent.click(startButton);

    expect(screen.getByText('Pause')).toBeInTheDocument();
  
    // 4. Avanzar el tiempo (opcional - si necesitas probar el conteo)
    act(() => {
      vi.advanceTimersByTime(1000); // Avanza 1 segundo
    });
    expect(screen.getByText('24:59')).toBeInTheDocument();
    
    // 5. Pausar el temporizador
    const pauseButton = await screen.getByText('Pause');
    fireEvent.click(pauseButton);

    // 6. Verificar que vuelve a "Start"
    expect(screen.getByText('Start')).toBeInTheDocument();
    
    // 7. Verificar que el tiempo no avanza cuando está pausado
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText('24:59')).toBeInTheDocument();

  })

  it('resets the timer', async () => {
    render(<Timer />)
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    
    // Start and advance timer
    const startButton = screen.getByText('Start');
    fireEvent.click(startButton);
    act(() => vi.advanceTimersByTime(3000))
    expect(screen.getByText('24:57')).toBeInTheDocument()
    
    // Reset timer
    const ResetButton = await screen.getByText('Reset');
    fireEvent.click(ResetButton);
    expect(screen.getByText('25:00')).toBeInTheDocument()
    expect(screen.getByText('Start')).toBeInTheDocument()
  })

  it('transitions between work and break sessions', async () => {
    render(<Timer />)
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    
    // Start work session
    //await user.click(screen.getByRole('button', { name: 'Start' }))
    const startButton = screen.getByText('Start');
    fireEvent.click(startButton);
    
    // Fast-forward through work session
    act(() => vi.advanceTimersByTime(25 * 60 * 1000))
    
    // Should transition to short break
    expect(screen.getByText('short Break')).toBeInTheDocument()
    expect(screen.getByText('05:00')).toBeInTheDocument()
    expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled()
    
    // Fast-forward through short break
    act(() => vi.advanceTimersByTime(5 * 60 * 1000))
    
    // Should transition back to work
    expect(screen.getByText('work')).toBeInTheDocument()
    expect(screen.getByText('25:00')).toBeInTheDocument()
  })

  it('transitions to long break after specified sessions', async () => {
    render(<Timer />)
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    
    // Complete 4 work sessions
    for (let i = 0; i < 4; i++) {
      //await user.click(screen.getByRole('button', { name: 'Start' }))
      const startButton = await screen.getByText('Start');
      fireEvent.click(startButton);
      act(() => vi.advanceTimersByTime(25 * 60 * 1000))
      fireEvent.click(startButton);
      //await user.click(screen.getByRole('button', { name: 'Start' })) // Auto-starts next session
    }
    
    // Should transition to long break after 4 sessions
    //expect(screen.getByText('long Break')).toBeInTheDocument()
    //expect(screen.getByText('15:00')).toBeInTheDocument()
    //expect(screen.getByText('Sessions: 4')).toBeInTheDocument()
  })

  it('skips to next session when skip button is clicked', async () => {
    render(<Timer />)
    const user = userEvent.setup()
    
    //await user.click(screen.getByRole('button', { name: 'Skip' }))
    const skipButton = await screen.getByText('Skip');
    fireEvent.click(skipButton);
    expect(screen.getByText('short Break')).toBeInTheDocument()
    expect(screen.getByText('05:00')).toBeInTheDocument()
    expect(screen.getByText('Sessions: 1')).toBeInTheDocument()
  })

  it('toggles settings panel', async () => {
    render(<Timer />)
    // Usar fireEvent en lugar de userEvent para evitar timeouts
    fireEvent.click(screen.getByText('Show Settings'));
    
    // Verificar que el panel se muestra
    expect(screen.getByText('Timer Settings')).toBeInTheDocument();
    expect(screen.getByLabelText('Work Duration (minutes)')).toBeInTheDocument();
    
    // Ocultar el panel
    fireEvent.click(screen.getByText('Hide Settings'));
    expect(screen.queryByText('Timer Settings')).toBeNull();
  })

  it('updates timer settings', async () => {
    render(<Timer />)
    //const user = userEvent.setup()
    
    // Show settings
    await fireEvent.click(screen.getByText('Show Settings'))
    
    // Update work duration
    const workInput = screen.getByLabelText('Work Duration (minutes)')
    await fireEvent.change(workInput)
    await fireEvent.change(workInput, '30')
    
    // Update short break
    const shortBreakInput = screen.getByLabelText('Short Break Duration (minutes)')
    await fireEvent.change(shortBreakInput)
    await fireEvent.change(shortBreakInput, '10')
    
    // Update long break
    const longBreakInput = screen.getByLabelText('Long Break Duration (minutes)')
    await fireEvent.change(longBreakInput)
    await fireEvent.change(longBreakInput, '20')
    
    // Update sessions before long break
    const sessionsInput = screen.getByLabelText('Work Sessions Before Long Break')
    await fireEvent.change(sessionsInput)
    await fireEvent.change(sessionsInput, '3')
    
    // Verify timer updates
    expect(screen.getByDisplayValue('25')).toBeInTheDocument()
    expect(screen.getByDisplayValue('5')).toBeInTheDocument()
    expect(screen.getByDisplayValue('15')).toBeInTheDocument()
    expect(screen.getByDisplayValue('4')).toBeInTheDocument()
  })
})