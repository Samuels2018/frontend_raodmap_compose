import { useState, useEffect } from 'react'
//import axios from 'axios'
//import { motion } from 'framer-motion'
//import SearchBar from './components/SearchBar'
//import CurrentWeather from './components/CurrentWeather'
//import HourlyForecast from './components/HourlyForecast'
import WeaterServiceApi from  '../../services/externalService'

const API_KEY = 'YOUR_VISUAL_CROSSING_API_KEY'
const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline'

const WeatheApi = () => {
  const [weatherData, setWeatherData] = useState(null)
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchWeather = async (loc) => {
    setLoading(true)
    setError(null)
    try {
      const response = await WeaterServiceApi()
      setWeatherData(response.data)
      setLocation(loc)
    } catch (err) {
      setError('Location not found. Please try another search.')
      console.error('Error fetching weather data:', err)
    } finally {
      setLoading(false)
    }
  }

  fetchWeather('New York, NY')

  return (
    <div>Some</div>
  )

  /*const handleSearch = (searchLocation) => {
    if (searchLocation.trim()) {
      fetchWeather(searchLocation)
    }
  }

  const handleRefresh = () => {
    if (location) {
      fetchWeather(location)
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          fetchWeather(`${latitude},${longitude}`)
        },
        (err) => {
          setError('Could not get your location. Please enable location services or search manually.')
          console.error('Geolocation error:', err)
        }
      )
    } else {
      setError('Geolocation is not supported by your browser.')
    }
  }

  useEffect(() => {
    // Get weather for default location or user's location on first load
    getCurrentLocation()
  }, [])

  return (
    <div className="min-h-screen p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Weather Forecast</h1>
        
        <SearchBar 
          onSearch={handleSearch} 
          onRefresh={handleRefresh} 
          onCurrentLocation={getCurrentLocation} 
          loading={loading}
        />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : weatherData ? (
          <>
            <CurrentWeather data={weatherData} />
            <HourlyForecast hours={weatherData.days[0].hours} />
          </>
        ) : (
          <div className="text-center text-gray-500 mt-8">
            {error ? '' : 'Search for a location to see weather data'}
          </div>
        )}
      </motion.div>
    </div>
  )*/
}

export default WeatheApi