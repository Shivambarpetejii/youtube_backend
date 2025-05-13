import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


const UserDeshbord = () => {
    const {user } = useAuth();
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
        <div className="max-w-2xl text-center">
          <h1 className="text-4xl font-bold text-gray-900">User Dashboard</h1>
          <p className="mt-3 text-lg text-gray-600">
            Welcome back, <strong>{user.fullName}</strong>!
          </p>
          <div className="mt-6">
            <Link
              to="/profile"
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Go to Profile
            </Link>
          </div>
        </div>
      </div>
    );
}

export default UserDeshbord