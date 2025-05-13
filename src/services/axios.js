import axios from 'axios'

const clientAxios = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
  },
})

export default clientAxios