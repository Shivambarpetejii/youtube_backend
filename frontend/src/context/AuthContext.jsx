import { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser, loginUser, logoutUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in on app load
  useEffect(() => {
    const checkUserAuth = async () => {
      setLoading(true);
      try {
        const res = await getCurrentUser();
        console.log("🔁 getCurrentUser response:", res);

        const currentUser = res?.data; // API format: { statusCode, data, message }
        if (currentUser) {
          setUser(currentUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("❌ Error fetching current user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserAuth();
  }, []);

  // Log user whenever it updates (for debug)
  useEffect(() => {
    console.log("✅ User state updated:", user);
  }, [user]);

  // Login function
  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await loginUser(credentials);
      const loggedInUser = res?.user ?? res?.data;
      setUser(loggedInUser);
      toast.success('Login successful!');
      console.log("hii sir");
    
      
      
      navigate('/');
     
      return true;
    } catch (error) {
      toast.error(error.message || 'Login failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setUser(null);
      toast.success('Logged out successfully!');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Logout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
