const API_BASE_URL = "https://api-production-298e.up.railway.app/v1";

// API Service for authentication
export const authService = {
  // Signup endpoint
  signup: async (email, phone) => {
    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle 409 Conflict (user already exists)
        if (response.status === 409) {
          throw new Error("An account with this email already exists. Please use a different email.");
        }
        throw new Error(data.message || "Signup failed");
      }

      // Handle both response structures: direct keys or nested apiKeys object
      const liveKey = data.liveKey || data.live || data.apiKeys?.live || '';
      const testKey = data.testKey || data.test || data.apiKeys?.test || '';

      // Store tokens and user data
      if (liveKey) localStorage.setItem("liveKey", liveKey);
      if (testKey) localStorage.setItem("testKey", testKey);
      if (data.token) localStorage.setItem("authToken", data.token);
      localStorage.setItem("userEmail", email);

      return { success: true, data: { liveKey, testKey, token: data.token } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Login endpoint
  login: async (email, phone) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store tokens and user data
      if (data.liveKey) localStorage.setItem("liveKey", data.liveKey);
      if (data.testKey) localStorage.setItem("testKey", data.testKey);
      if (data.token) localStorage.setItem("authToken", data.token);
      localStorage.setItem("userEmail", email);

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("authToken");
  },

  // Get stored API keys
  getApiKeys: () => {
    return {
      liveKey: localStorage.getItem("liveKey"),
      testKey: localStorage.getItem("testKey"),
    };
  },

  // Logout
  logout: () => {
    localStorage.removeItem("liveKey");
    localStorage.removeItem("testKey");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
  },
};
