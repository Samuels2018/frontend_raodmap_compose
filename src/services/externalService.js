import axios from 'axios'

const WeaterServiceApi = () => {
  // Configuración recomendada
  const API_URL = 'https://api.openweathermap.org/data/2.5/onecall';
  const API_KEY = process.env.REACT_APP_API_KEY; // Asegúrate que esté en .env
  
  const params = {
    lat: 33.44,
    lon: -94.04,
    appid: API_KEY,
    units: 'metric', // o 'imperial'
    lang: 'es' // opcional: para respuestas en español
  };

  return axios.get(API_URL, { params })
    .then((response) => {
      console.log('Weather data:', response.data);
      return response.data;
    })
    .catch((err) => {
      console.error('Error fetching weather data:', err.response?.data || err.message);
      throw new Error('Failed to fetch weather data');
    });
};


export default WeaterServiceApi