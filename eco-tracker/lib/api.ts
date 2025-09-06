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

export interface ShopRegistration {
  email: string;
  password: string;
  name: string;
  address: string;
  phone: string;
  description: string;
}

export interface ShopItem {
  id: number;
  name: string;
  price: number;
  category: string;
  description?: string;
  is_eco_friendly?: boolean;
}

export interface Receipt {
  id: number;
  user_id: number;
  shop_id: number;
  total_amount: number;
  points_earned: number;
  created_at: string;
}

export interface Challenge {
  id: number;
  name: string;
  description: string;
  icon: string;
  target: number;
  progress: number;
  earned: boolean;
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

  // Shop registration with items
  static async registerShop(shopData: ShopRegistration, items: ShopItem[]): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/shops/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...shopData,
        items: items
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return response.json();
  }

  // Add item to shop
  static async addShopItem(shopId: number, item: ShopItem): Promise<ShopItem> {
    // Determine if item is eco-friendly based on category
    const isEcoFriendly = ['Organic', 'Eco-Friendly', 'Fruits', 'Vegetables'].includes(item.category);
    
    const itemData = {
      name: item.name,
      price: item.price,
      category: item.category,
      description: item.description || `${item.category} product`,
      is_eco_friendly: isEcoFriendly
    };

    const response = await fetch(`${API_BASE_URL}/shops/${shopId}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return response.json();
  }

  // Get shop items
  static async getShopItems(shopId: number): Promise<ShopItem[]> {
    const response = await fetch(`${API_BASE_URL}/shops/${shopId}/items`);

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

  // Validate customer by email or phone
  static async validateCustomer(identifier: string): Promise<User | null> {
    try {
      console.log('API call to validate customer:', identifier)
      const response = await fetch(`${API_BASE_URL}/users/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier }),
      });

      console.log('Response status:', response.status)
      if (!response.ok) {
        const errorText = await response.text()
        console.log('Error response:', errorText)
        return null;
      }

      const result = await response.json();
      console.log('API validation result:', result)
      return result;
    } catch (error) {
      console.error('API validation error:', error)
      return null;
    }
  }

  // Get user receipts
  static async getUserReceipts(userId: number): Promise<Receipt[]> {
    console.log('API: Fetching receipts for user:', userId)
    const response = await fetch(`${API_BASE_URL}/users/${userId}/receipts`);

    console.log('API: getUserReceipts response status:', response.status)
    if (!response.ok) {
      const error = await response.text();
      console.error('API: getUserReceipts error:', error)
      throw new Error(error);
    }

    const receipts = await response.json();
    console.log('API: getUserReceipts result:', receipts)
    return receipts;
  }

  // Get user challenges
  static async getUserChallenges(userId: number): Promise<Challenge[]> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/challenges`);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return response.json();
  }

  // Get shop receipts
  static async getShopReceipts(shopId: number): Promise<Receipt[]> {
    const response = await fetch(`${API_BASE_URL}/shops/${shopId}/receipts`);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return response.json();
  }

  // Create receipt
  static async createReceipt(receiptData: any): Promise<Receipt> {
    const response = await fetch(`${API_BASE_URL}/receipts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(receiptData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return response.json();
  }

  // Delete receipt
  static async deleteReceipt(receiptId: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/receipts/${receiptId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return response.json();
  }

  // Get all receipts (admin function)
  static async getAllReceipts(): Promise<Receipt[]> {
    const response = await fetch(`${API_BASE_URL}/admin/receipts`);

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
