import axios from 'axios';

const api = axios.create({
	baseURL: 'https://sigos-backend.fly.dev/api/v1'
});

export default api;
