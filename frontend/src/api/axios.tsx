import axios from 'axios';

export default axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_BASEURL}`,
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
  },
  responseType: 'json',
});
