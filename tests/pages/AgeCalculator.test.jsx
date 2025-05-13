import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AgeCalculator from '../../src/pages/AgeCalculator/AgeCalculator'
import { vi } from 'vitest'

describe('AgeCalculator', () => {
  beforeEach(() => {
    // Mockear la fecha actual para tener tests consistentes
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2023-05-15'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renderiza correctamente el formulario', async() => {
    render(<AgeCalculator />)
    
    expect(screen.getByText('Calculadora de Edad')).toBeInTheDocument()
    expect(screen.getByLabelText('Fecha de Nacimiento:')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Calcular Edad' })).toBeInTheDocument()
  })

  it('muestra error cuando no se ingresa fecha', async () => {
    render(<AgeCalculator />)
    
    await fireEvent.submit(screen.getByTestId('age-form'))
  
    expect(screen.getByText('Por favor selecciona una fecha de nacimiento')).toBeInTheDocument();
  })

  it('muestra error cuando la fecha es en el futuro', async () => {
    render(<AgeCalculator />)
    
    const dateInput = screen.getByLabelText('Fecha de Nacimiento:')
    fireEvent.change(dateInput, { target: { value: '2024-01-01' } })
    fireEvent.submit(screen.getByRole('form'))
    
    expect(await screen.getByText('La fecha de nacimiento no puede ser en el futuro')).toBeInTheDocument()
  })

  it('calcula correctamente la edad para una fecha pasada', async () => {
    // 1. Configuración inicial
    vi.useFakeTimers();
    render(<AgeCalculator />);
    
    // 2. Usa fireEvent.change para inputs de fecha (más confiable)
    const dateInput = screen.getByLabelText('Fecha de Nacimiento:');
    fireEvent.change(dateInput, { target: { value: '1990-05-10' } });
    
    // 3. Simula el submit
    fireEvent.click(screen.getByText('Calcular Edad'));
    
    // 4. Verifica estado de carga
    expect(screen.getByText('Calculando...')).toBeInTheDocument();
    
    // 5. Avanza los timers mockeados
    act(() => {
      vi.advanceTimersByTime(500); // Versión síncrona
    });
    
    // 6. Verificaciones finales
    expect(await screen.getByText('Tu edad es:')).toBeInTheDocument(); // findByText es async
    expect(screen.getByText('33')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    
    // 7. Limpieza
    vi.useRealTimers();
  })

  it('calcula correctamente la edad cuando el cumpleaños no ha ocurrido este año', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-05-15')); // Fecha actual simulada
    
    // 2. Renderizar componente
    render(<AgeCalculator />);
    
    // 3. Usar fireEvent para input de fecha (más confiable que user.type)
    const dateInput = screen.getByLabelText('Fecha de Nacimiento:');
    fireEvent.change(dateInput, { target: { value: '1990-06-20' } });
    
    // 4. Simular envío del formulario
    fireEvent.click(screen.getByText('Calcular Edad'));
    
    // 5. Avanzar timers manualmente
    act(() => {
      vi.advanceTimersByTime(500); // Avanza 500ms para completar el cálculo
    });
    
    // 6. Verificar resultados
    expect(await screen.getByText('Tu edad es:')).toBeInTheDocument();
    expect(screen.getByText('32')).toBeInTheDocument(); // años
    expect(screen.getByText('10')).toBeInTheDocument(); // meses
    expect(screen.getByText('25')).toBeInTheDocument(); // días
    
    // 7. Limpiar mocks
    vi.useRealTimers();
  })

  it('deshabilita el botón durante el cálculo', async () => {
    // 1. Configurar timers falsos
    vi.useFakeTimers();
    
    // 2. Renderizar componente
    render(<AgeCalculator />);
    
    // 3. Usar fireEvent para input de fecha (más confiable)
    const dateInput = screen.getByLabelText('Fecha de Nacimiento:');
    fireEvent.change(dateInput, { target: { value: '1990-05-10' } });
    
    // 4. Obtener el botón
    const calculateButton = screen.getByRole('button', { name: 'Calcular Edad' });
    
    // 5. Simular clic
    fireEvent.click(calculateButton);
    
    // 6. Verificar estado durante cálculo
    expect(calculateButton).toBeDisabled();
    expect(calculateButton).toHaveTextContent('Calculando...');
    
    // 7. Avanzar timers manualmente
    act(() => {
      vi.advanceTimersByTime(500); // Avanzar 500ms
    });
    
    // 8. Verificar estado final
    expect(calculateButton).toBeEnabled();
    expect(calculateButton).toHaveTextContent('Calcular Edad');
    
    // 9. Limpiar mocks
    vi.useRealTimers();
  })

  it('muestra el resultado con el formato correcto', async () => {
    // 1. Configurar timers falsos y fecha mock
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2023-05-15'));

  // 2. Renderizar componente
  render(<AgeCalculator />);

  // 3. Usar fireEvent para input de fecha (más confiable)
  const dateInput = screen.getByLabelText('Fecha de Nacimiento:');
  fireEvent.change(dateInput, { target: { value: '1990-05-10' } });

  // 4. Simular envío del formulario
  fireEvent.click(screen.getByText('Calcular Edad'));

  // 5. Avanzar timers manualmente
  act(() => {
    vi.advanceTimersByTime(500); // Avanza 500ms para completar el cálculo
  });

  // 6. Verificar la estructura del resultado
  const resultSection = await screen.getByText('Tu edad es:')
  

  // Verificar los tres componentes (años, meses, días)
  expect(screen.getByText('Años')).toBeInTheDocument();
  expect(screen.getByText('Meses')).toBeInTheDocument();
  expect(screen.getByText('Días')).toBeInTheDocument();

  // 7. Limpiar mocks
  vi.useRealTimers();
  })
})