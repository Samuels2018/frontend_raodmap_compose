import { useState } from "react"

const AgeCalculator = () => {
  const [birthDate, setBirthDate] = useState("")
  const [age, setAge] = useState(null)
  const [error, setError] = useState(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const calculateAge = (e) => {
    e.preventDefault()
    setError(null)

    if (!birthDate || birthDate === "") {
      setError("Por favor selecciona una fecha de nacimiento")
      return
    }

    const birthDateObj = new Date(birthDate)
    const today = new Date()

    if (birthDateObj > today) {
      setError("La fecha de nacimiento no puede ser en el futuro")
      return
    }

    setIsCalculating(true)

    // Simulamos un pequeño retraso para mostrar el estado de cálculo
    setTimeout(() => {
      let years = today.getFullYear() - birthDateObj.getFullYear()
      let months = today.getMonth() - birthDateObj.getMonth()
      let days = today.getDate() - birthDateObj.getDate()

      if (days < 0) {
        const daysInLastMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate()
        days += daysInLastMonth
        months--
      }

      if (months < 0) {
        months += 12
        years--
      }

      setAge({ years, months, days })
      setIsCalculating(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-violet-500 to-purple-600 py-5 px-6">
          <h1 className="text-2xl font-bold text-center text-white">Calculadora de Edad</h1>
        </div>

        <div className="p-6 space-y-6">
          <form onSubmit={calculateAge} className="space-y-5" role="form" data-testid="age-form">
            <div className="space-y-2">
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                Fecha de Nacimiento:
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="birthDate"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center py-3 px-4 bg-red-50 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isCalculating}
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isCalculating ? "Calculando..." : "Calcular Edad"}
            </button>
          </form>

          {age && !error && (
            <div className="mt-6 p-5 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg border border-purple-100">
              <h2 className="text-lg font-semibold text-center text-gray-800 mb-4">Tu edad es:</h2>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100 transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <span className="block text-3xl font-bold text-violet-600">{age.years}</span>
                  <span className="text-sm text-gray-600">Años</span>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100 transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <span className="block text-3xl font-bold text-violet-600">{age.months}</span>
                  <span className="text-sm text-gray-600">Meses</span>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100 transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <span className="block text-3xl font-bold text-violet-600">{age.days}</span>
                  <span className="text-sm text-gray-600">Días</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


export default AgeCalculator