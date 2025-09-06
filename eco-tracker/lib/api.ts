// API service to communicate with the GoFr backend
const API_BASE_URL = 'http://localhost:8000/api';

export interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  points: number;
  created_at: string;
  updated_at: string;
}

export interface UserRegistration {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export class ApiService {
  // User registration
  static async registerUser(userData: UserRegistration): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return response.json();
  }

  // User login
  static async loginUser(loginData: UserLogin): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return response.json();
  }

  // Get user by ID
  static async getUser(id: number): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return response.json();
  }

  // Health check
  static async healthCheck(): Promise<{ status: string; database: string }> {
    const response = await fetch('http://localhost:8000/health');
    
    if (!response.ok) {
      throw new Error('Backend is not running');
    }

    return response.json();
  }
}
