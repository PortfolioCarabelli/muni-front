import axiosInstance from './utils/axiosInstance';

const getAllIncidentes = async () => {
  try {
    const response = await axiosInstance.get('/api/incidentes/incidentes');
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getIncidenteById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/incidentes/incidentes/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createIncidente = async (incidentData) => {
  try {
    const response = await axiosInstance.post('/api/incidentes/incidentes', incidentData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateIncidente = async (id, updatedData) => {
  try {
    const response = await axiosInstance.put(`/api/incidentes/incidentes/${id}`, updatedData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteIncidente = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/incidentes/incidentes/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateIncidenteEstadoObservacion = async (id, newState, observationData) => {
  try {
    const response = await axiosInstance.put(`/api/incidentes/incidentes/${id}/estado-observacion`, { nuevoEstado: newState, ...observationData }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const addObservacionToIncidente = async (id, observationData) => {
  try {
    const response = await axiosInstance.post(`/api/incidentes/incidentes/${id}/observaciones`, observationData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateIncidenteEstado = async (id, newState) => {
  try {
    const response = await axiosInstance.put(`/api/incidentes/incidentes/${id}/estado`, { nuevoEstado: newState }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const IncidenteService = {
  getAllIncidentes,
  getIncidenteById,
  createIncidente,
  updateIncidente,
  deleteIncidente,
  updateIncidenteEstadoObservacion,
  addObservacionToIncidente,
  updateIncidenteEstado
};

export default IncidenteService;
