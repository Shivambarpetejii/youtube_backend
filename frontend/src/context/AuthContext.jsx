import { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser, loginUser, logoutUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
<<<<<<< HEAD

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

=======
import { jwtDecode } from 'jwt-decode';


// Create context
const AuthContext = createContext();

// Hook to use context
export const useAuth = () => useContext(AuthContext);

// Provider component
>>>>>>> Resolved merge conflicts
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

<<<<<<< HEAD
  // Check if user is already logged in on app load
=======
  // Fetch current user on mount
>>>>>>> Resolved merge conflicts
  useEffect(() => {
    const checkUserAuth = async () => {
      setLoading(true);
      try {
<<<<<<< HEAD
        const res = await getCurrentUser();
        console.log("🔁 getCurrentUser response:", res);

        const currentUser = res?.data; // API format: { statusCode, data, message }
        if (currentUser) {
          setUser(currentUser);
        } else {
          setUser(null);
        }
=======
        const res = await getCurrentUser(); // hit /current-user
        const currentUser = res?.data;
        setUser(currentUser || null);
>>>>>>> Resolved merge conflicts
      } catch (error) {
        console.error("❌ Error fetching current user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserAuth();
<<<<<<< HEAD
  }, []);

  // Log user whenever it updates (for debug)
=======

    // If redirected from Google login
    const checkGoogleRedirect = () => {
      if (window.location.pathname.includes('/dashboard')) {
        checkUserAuth(); // refresh user data
      }
    };

    checkGoogleRedirect();
  }, []);

>>>>>>> Resolved merge conflicts
  useEffect(() => {
    console.log("✅ User state updated:", user);
  }, [user]);

<<<<<<< HEAD
  // Login function
=======
  // Standard login
>>>>>>> Resolved merge conflicts
  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await loginUser(credentials);
      const loggedInUser = res?.user ?? res?.data;
      setUser(loggedInUser);
      toast.success('Login successful!');
<<<<<<< HEAD
      console.log("hii sir");
    
      
      
      navigate('/');
     
=======
      navigate('/');
>>>>>>> Resolved merge conflicts
      return true;
    } catch (error) {
      toast.error(error.message || 'Login failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  // Logout function
=======
  // Logout
>>>>>>> Resolved merge conflicts
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

<<<<<<< HEAD
=======
  // ✅ Google login handler — decode token & set user
  const setUserFromToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      localStorage.setItem('access_token', token); // optional
  
      // ✅ Set cookie so backend can read it
      document.cookie = `access_token=${token}; path=/; max-age=86400`;
  
      setUser(decoded);
    } catch (error) {
      console.error("❌ Failed to decode token:", error);
      toast.error("Invalid Google login token.");
    }
  };
  

  // Context value
>>>>>>> Resolved merge conflicts
  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
<<<<<<< HEAD
=======
    setUserFromToken, // expose this for Google login
>>>>>>> Resolved merge conflicts
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
<<<<<<< HEAD

export default AuthContext;
=======
>>>>>>> Resolved merge conflicts
