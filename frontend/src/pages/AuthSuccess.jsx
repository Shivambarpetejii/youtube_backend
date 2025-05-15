// In src/pages/AuthSuccess.jsx or wherever you have the AuthSuccess component
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Adjust import based on your project structure
import toast from 'react-hot-toast';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { setUserFromToken } = useAuth(); // You'll need to expose this in your AuthContext

  useEffect(() => {
    if (token) {
      try {
        localStorage.setItem('access_token', token);
  
        // ✅ Set token as a cookie (must match backend expectations)
        document.cookie = `access_token=${token}; path=/; max-age=86400; SameSite=Lax`;
  
        setUserFromToken(token); // parse token and set user context
  
        toast.success('Logged in with Google');
  
        setTimeout(() => {
          navigate('/'); // Redirect to protected route
        }, 300);
      } catch (error) {
        toast.error('Google login failed');
        navigate('/login');
      }
    } else {
      toast.error('Missing token');
      navigate('/login');
    }
  }, [token]);
  

  return <div className="text-center mt-20">Processing login...</div>;
};

export default AuthSuccess;
