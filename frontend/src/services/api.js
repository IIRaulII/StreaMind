import axios from 'axios';
import Cookies from 'js-cookie';

// Determinar la URL base de la API según el entorno
// En producción usará la variable de entorno, en desarrollo fallback a localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Configuración base para axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default {
  // Autenticación
  auth: {
    // Registro de usuario
    register: async (userData) => {
      try {
        const response = await api.post('/auth/register', userData);
        if (response.data.token) {
          Cookies.set('token', response.data.token, { expires: 30 });
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: 'Error en el servidor' };
      }
    },

    // Inicio de sesión
    login: async (credentials) => {
      try {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
          Cookies.set('token', response.data.token, { expires: 30 });
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: 'Error en el servidor' };
      }
    },

    // Cerrar sesión
    logout: () => {
      Cookies.remove('token');
      localStorage.removeItem('user');
    },

    // Obtener perfil de usuario actual
    getProfile: async () => {
      try {
        const response = await api.get('/auth/me');
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: 'Error en el servidor' };
      }
    }
  },

  // Usuarios
  users: {
    // Actualizar perfil
    updateProfile: async (userData) => {
      try {
        const response = await api.put('/users/profile', userData);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: 'Error en el servidor' };
      }
    },

    // Subir avatar
    uploadAvatar: async (formData) => {
      try {
        const response = await api.post('/users/avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        // Actualizar los datos de usuario en localStorage con la nueva URL del avatar
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          user.avatarUrl = response.data.avatarUrl;
          localStorage.setItem('user', JSON.stringify(user));
        }
        
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: 'Error en el servidor' };
      }
    },

    // Obtener usuario por ID
    getById: async (userId) => {
      try {
        const response = await api.get(`/users/${userId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: 'Error en el servidor' };
      }
    }
  },

  // Películas
  movies: {
    // Listar películas (con posibles filtros, paginación, etc.)
    getAll: async (params = {}) => {
      try {
        const response = await api.get('/movies', { params });
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: 'Error en el servidor' };
      }
    },

    // Obtener película por ID
    getById: async (id) => {
      try {
        const response = await api.get(`/movies/${id}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: 'Error en el servidor' };
      }
    },

    // Buscar películas en TMDb
    search: async (query) => {
      try {
        const response = await api.get(`/movies/search?query=${encodeURIComponent(query)}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: 'Error en el servidor' };
      }
    },

    // Obtener detalles de TMDb
    getTmdbDetails: async (tmdbId) => {
      try {
        const response = await api.get(`/movies/tmdb/${tmdbId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: 'Error en el servidor' };
      }
    },

    // Crear película desde TMDb
    createFromTmdb: async (tmdbId) => {
      try {
        const response = await api.post('/movies/tmdb', { tmdbId });
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: 'Error en el servidor' };
      }
    },

    // Crear película manualmente
    create: async (movieData) => {
      try {
        const response = await api.post('/movies', movieData);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: 'Error en el servidor' };
      }
    },

    // Actualizar película
    update: async (id, movieData) => {
      try {
        const response = await api.put(`/movies/${id}`, movieData);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: 'Error en el servidor' };
      }
    },

    // Eliminar película
    delete: async (id) => {
      try {
        const response = await api.delete(`/movies/${id}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: 'Error en el servidor' };
      }
    },

    // Subir póster
    uploadPoster: async (id, formData) => {
      try {
        const response = await api.post(`/movies/${id}/poster`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: 'Error en el servidor' };
      }
    },

    // Marcar como vista
    toggleWatched: async (id) => {
      try {
        const response = await api.post(`/movies/${id}/watch`);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: 'Error en el servidor' };
      }
    },

    // Marcar para ver más tarde
    toggleToWatch: async (id) => {
      try {
        const response = await api.post(`/movies/${id}/to-watch`);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: 'Error en el servidor' };
      }
    },

    // Marcar como favorita
    toggleFavorite: async (id) => {
      try {
        const response = await api.post(`/movies/${id}/favorite`);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: 'Error en el servidor' };
      }
    },

    // Valorar película
    rate: async (id, rating) => {
      try {
        const response = await api.post(`/movies/${id}/rate`, rating);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: 'Error en el servidor' };
      }
    },

    // Eliminar valoración
    deleteRating: async (id) => {
      try {
        const response = await api.delete(`/movies/${id}/rate`);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: 'Error en el servidor' };
      }
    }
  }
}; 