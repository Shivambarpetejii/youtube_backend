import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Auth App</Link>
        
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:text-gray-300">Home</Link>
            </li>
            
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/profile" className="hover:text-gray-300">Profile</Link>
                </li>
                <li>
<<<<<<< HEAD
=======
                  <Link to="/change-password" className="hover:text-gray-300">Change Password</Link>
                </li>
                <li>
>>>>>>> Resolved merge conflicts
                  <button 
                    onClick={logout} 
                    className="hover:text-gray-300"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="hover:text-gray-300">Login</Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-gray-300">Register</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;