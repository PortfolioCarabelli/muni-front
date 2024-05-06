import axios from 'axios';
import setAuthorizationToken from './setAuthorizationToken';
import AuthService from '../auth.service';


const axiosInstance = axios.create({
  baseURL: 'https://muni-backend.munilagranja.com', 
  // baseURL: 'http://localhost:8000', 
}); 

axiosInstance.interceptors.request.use(
  (config) => {
    const access_token = localStorage.getItem('access_token');
    config.headers['x-site-id'] = localStorage.getItem('center');

    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
  },
  async (onError) => {
    if (onError.response.status === 401) {
      const response = await axiosInstance.post('/refresh', {}, { withCredentials: true });
      if (response.status === 200) {
        setAuthorizationToken(response.data.access_token);
        return axiosInstance(onError.config);
      }
    }
    return onError;
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh_token = localStorage.getItem('refresh_token');
      AuthService.refreshToken(refresh_token).then((res) => {
        window.localStorage.setItem('access_token', res.data.access_token);
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${res.data.access_token}`;
        window.location.reload();
        return axiosInstance(originalRequest);
      });
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
