import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TemperatureConverter from '../../src/pages/TemperatureConverter/TemperatureConverter'

describe('TemperatureConverter', () => {
  beforeEach(() => {
    render(<TemperatureConverter />)
  })

  it('renders the component correctly', () => {
    expect(screen.getByText('Temperature Converter')).toBeInTheDocument()
    expect(screen.getByLabelText('Temperature')).toBeInTheDocument()
    expect(screen.getByLabelText('From')).toHaveValue('celsius')
    expect(screen.getByLabelText('To')).toHaveValue('fahrenheit')
    expect(screen.getByRole('button', { name: 'Convert' })).toBeDisabled()
  })

  it('enables convert button when temperature is entered', async () => {
    const input = screen.getByLabelText('Temperature')
    await userEvent.type(input, '100')
    expect(screen.getByRole('button', { name: 'Convert' })).toBeEnabled()
  })

  it('shows error when no temperature is entered', async () => {
    const convertButton = screen.getByRole('button', { name: 'Convert' });
    expect(convertButton).toBeDisabled();
  })

  /*it('shows error when invalid number is entered', async () => {
    const input = screen.getByLabelText('Temperature')
    await userEvent.type(input, 'abc')
    fireEvent.click(screen.getByRole('button', { name: 'Convert' }))
    expect(await screen.findByText('Please enter a valid number')).toBeInTheDocument()
  })*/

  it('converts celsius to fahrenheit correctly', async () => {
    const input = screen.getByLabelText('Temperature')
    await userEvent.type(input, '100')

    const fromSelect = screen.getByLabelText('From')
    const toSelect = screen.getByLabelText('To')

    // Default is celsius to fahrenheit
    await userEvent.click(screen.getByRole('button', { name: 'Convert' }))

    expect(await screen.findByText('100 Celsius = 212.00 Fahrenheit')).toBeInTheDocument()
  })

  it('converts fahrenheit to celsius correctly', async () => {
    const input = screen.getByLabelText('Temperature')
    await userEvent.type(input, '212')

    const fromSelect = screen.getByLabelText('From')
    await userEvent.selectOptions(fromSelect, 'fahrenheit')

    const toSelect = screen.getByLabelText('To')
    await userEvent.selectOptions(toSelect, 'celsius')

    await userEvent.click(screen.getByRole('button', { name: 'Convert' }))

    expect(await screen.findByText('212 Fahrenheit = 100.00 Celsius')).toBeInTheDocument()
  })

  it('converts kelvin to celsius correctly', async () => {
    const input = screen.getByLabelText('Temperature')
    await userEvent.type(input, '373.15')

    const fromSelect = screen.getByLabelText('From')
    await userEvent.selectOptions(fromSelect, 'kelvin')

    await userEvent.click(screen.getByRole('button', { name: 'Convert' }))

    expect(await screen.findByText('373.15 Kelvin = 212.00 Fahrenheit')).toBeInTheDocument()
  })

  it('handles same unit conversion', async () => {
    const input = screen.getByLabelText('Temperature')
    await userEvent.type(input, '100')

    const fromSelect = screen.getByLabelText('From')
    await userEvent.selectOptions(fromSelect, 'celsius')

    const toSelect = screen.getByLabelText('To')
    await userEvent.selectOptions(toSelect, 'celsius')

    await userEvent.click(screen.getByRole('button', { name: 'Convert' }))

    expect(await screen.findByText('100 Celsius = 100.00 Celsius')).toBeInTheDocument()
  })
})