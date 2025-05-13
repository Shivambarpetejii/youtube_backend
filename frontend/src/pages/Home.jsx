import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminDashbord from './admin/AdminDashbord';
import UserDeshbord from './user/UserDashbord';


const Home = () => {
  const { isAuthenticated, user } = useAuth();




  // Render for Unauthenticated Visitors
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">Welcome to Auth App</h1>
          <p className="mt-3 text-xl text-gray-600">
            Please login or register to continue.
          </p>
          <div className="mt-8 space-y-4">
            <Link
              to="/login"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border-gray-300"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render for Admin
  if (user?.role === 'admin') {
   return(
    <AdminDashbord/>
   )

  }

  // Render for Normal User
  return (
   <UserDeshbord/>
  );
};

export default Home;
