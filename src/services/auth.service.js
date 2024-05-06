import axiosInstance from './utils/axiosInstance';

const login = async (email, password) => {
  try {
    const response = await axiosInstance.post('/api/auth/login', { email, password });
    if (response.data.token) {
      // Si el inicio de sesión es exitoso, guardar el token en el almacenamiento local
      localStorage.setItem('token', response.data.token);
      // Guardar el nombre completo en el almacenamiento local
      localStorage.setItem('fullName', response.data.fullName);
      // Guardar el roleCode en el almacenamiento local si está presente en la respuesta
      if (response.data.roleCode) {
        localStorage.setItem('roleCode', response.data.roleCode);
      }
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

const sendRecoverEmail = async (email) => {
  try {
    const response = await axiosInstance.post('/api/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};


const resetPassword = async (token, newPassword) => {
  try {
    const response = await axiosInstance.post('/api/auth/reset-password', { token, newPassword });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get('/api/auth/users');
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createUser = async (email, password, first_name, last_name, roleCode) => {
  try {
    const response = await axiosInstance.post('/api/auth/user', { email, password, first_name, last_name, roleCode });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateUser = async (userId, email, password,  first_name, last_name, roleCode) => {
  try {
    const response = await axiosInstance.put(`/api/auth/user/${userId}`,  { email, password, first_name, last_name, roleCode });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (userId) => {
  try {
    const response = await axiosInstance.delete(`/api/auth/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const AuthService = {
  login,
  sendRecoverEmail,
  resetPassword,
  createUser,
  updateUser,
  deleteUser,
  getAllUsers 
};

export default AuthService;
