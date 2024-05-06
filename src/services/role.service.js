import axiosInstance from './utils/axiosInstance';


const getAllRoles = async () => {
  try {
    const response = await axiosInstance.get('/api/roles');
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createRole = async (name, code, permissions) => {
  try {
    const response = await axiosInstance.post('/api/roles', { name, code, permissions });
    return response.data;
  } catch (error) {
    throw error;
  }
};



const RoleService  = {
  getAllRoles,
  createRole
};

export default RoleService;
