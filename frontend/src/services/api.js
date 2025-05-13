import axios from 'axios';

const API_URL = 'http://localhost:9000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies/session management
  headers: {
    'Content-Type': 'application/json',
  }
});

// Auth services
export const registerUser = async (userData) => {
  try {
    const formData = new FormData();
    formData.append('fullName', userData.fullName);
    formData.append('email', userData.email);
    formData.append('username', userData.username);
    formData.append('password', userData.password);
    formData.append('role', userData.role);
    
    if (userData.avatar) {
      formData.append('avatar', userData.avatar);
    }
    
    if (userData.coverImage) {
      formData.append('coverImage', userData.coverImage);
    }

    const response = await api.post('/users/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/users/login', credentials);
    
    
    
    
    return response.data;
    
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post('/users/logout');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/users/current-user');

    
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from local storage if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 unauthorized error
    if (error.response && error.response.status === 401) {
      // Redirect to login or refresh token
      console.log('Unauthorized: Redirecting to login');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;