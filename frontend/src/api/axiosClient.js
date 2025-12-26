import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '/api', // <--- QUAN TRỌNG: Chỉ để /api (Không điền http://127.0.0.1:5000 nữa)
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});

// Interceptors giữ nguyên như cũ
axiosClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axiosClient.post('/auth/refresh');
        if (res.data.accessToken) {
          localStorage.setItem('token', res.data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
          return axiosClient(originalRequest);
        }
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('user_display_name');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;