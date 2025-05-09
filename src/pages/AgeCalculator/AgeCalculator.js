import React, { useState } from 'react';

const AgeCalculator = () => {
  const [birthDate, setBirthDate] = useState('');
  const [age, setAge] = useState(null);
  const [error, setError] = useState('');

  const calculateAge = (e) => {
    e.preventDefault();
    
    if (!birthDate) {
      setError('Por favor ingresa tu fecha de nacimiento');
      return;
    }
    
    const birthDateObj = new Date(birthDate);
    const today = new Date();
    
    if (birthDateObj > today) {
      setError('La fecha de nacimiento no puede ser en el futuro');
      return;
    }
    
    setError('');
    
    let years = today.getFullYear() - birthDateObj.getFullYear();
    let months = today.getMonth() - birthDateObj.getMonth();
    let days = today.getDate() - birthDateObj.getDate();
    
    // Ajustar si el cumpleaños aún no ha ocurrido este año
    if (months < 0 || (months === 0 && days < 0)) {
      years--;
      months += 12;
    }
    
    // Ajustar días si es negativo
    if (days < 0) {
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
      months--;
    }
    
    setAge({
      years,
      months,
      days
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Calculadora de Edad</h1>
        
        <form onSubmit={calculateAge} className="space-y-4">
          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Nacimiento:
            </label>
            <input
              type="date"
              id="birthDate"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          {error && (
            <div className="text-red-500 text-sm text-center py-2">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
          >
            Calcular Edad
          </button>
        </form>
        
        {age && !error && (
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h2 className="text-lg font-semibold text-center text-gray-800 mb-3">Tu edad es:</h2>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white p-3 rounded shadow">
                <span className="block text-2xl font-bold text-blue-600">{age.years}</span>
                <span className="text-sm text-gray-600">Años</span>
              </div>
              <div className="bg-white p-3 rounded shadow">
                <span className="block text-2xl font-bold text-blue-600">{age.months}</span>
                <span className="text-sm text-gray-600">Meses</span>
              </div>
              <div className="bg-white p-3 rounded shadow">
                <span className="block text-2xl font-bold text-blue-600">{age.days}</span>
                <span className="text-sm text-gray-600">Días</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgeCalculator;