import { useState } from 'react';

const TemperatureConverter = () => {
  const [temperature, setTemperature] = useState('');
  const [fromUnit, setFromUnit] = useState('celsius');
  const [toUnit, setToUnit] = useState('fahrenheit');
  const [convertedTemp, setConvertedTemp] = useState(null);
  const [error, setError] = useState('');

  const temperatureUnits = [
    { value: 'celsius', label: 'Celsius (°C)' },
    { value: 'fahrenheit', label: 'Fahrenheit (°F)' },
    { value: 'kelvin', label: 'Kelvin (K)' },
  ];

  const convertTemperature = () => {
    setError('');
    
    // Validate input
    if (temperature === '') {
      setError('Please enter a temperature value');
      return;
    }
    
    const tempValue = parseFloat(temperature);
    if (isNaN(tempValue)) {
      setError('Please enter a valid number');
      return;
    }

    let result;
    
    // Convert to Celsius first
    let celsius;
    switch (fromUnit) {
      case 'celsius':
        celsius = tempValue;
        break;
      case 'fahrenheit':
        celsius = (tempValue - 32) * 5/9;
        break;
      case 'kelvin':
        celsius = tempValue - 273.15;
        break;
      default:
        celsius = tempValue;
    }
    
    // Then convert from Celsius to target unit
    switch (toUnit) {
      case 'celsius':
        result = celsius;
        break;
      case 'fahrenheit':
        result = (celsius * 9/5) + 32;
        break;
      case 'kelvin':
        result = celsius + 273.15;
        break;
      default:
        result = celsius;
    }
    
    setConvertedTemp(result.toFixed(2));
  };

  const isConvertDisabled = temperature === '';

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Temperature Converter</h1>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-1">
              Temperature
            </label>
            <input
              type="number"
              id="temperature"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter temperature"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="fromUnit" className="block text-sm font-medium text-gray-700 mb-1">
                From
              </label>
              <select
                id="fromUnit"
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {temperatureUnits.map((unit) => (
                  <option key={`from-${unit.value}`} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="toUnit" className="block text-sm font-medium text-gray-700 mb-1">
                To
              </label>
              <select
                id="toUnit"
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {temperatureUnits.map((unit) => (
                  <option key={`to-${unit.value}`} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <button
            onClick={convertTemperature}
            disabled={isConvertDisabled}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${isConvertDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            Convert
          </button>
          
          {convertedTemp !== null && (
            <div className="mt-4 p-4 bg-blue-50 rounded-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-1">Result</h2>
              <p className="text-xl">
                {temperature} {temperatureUnits.find(u => u.value === fromUnit)?.label.split(' ')[0]} = {convertedTemp} {temperatureUnits.find(u => u.value === toUnit)?.label.split(' ')[0]}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemperatureConverter;