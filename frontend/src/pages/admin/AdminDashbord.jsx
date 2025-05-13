import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


const AdminDashbord = () => {
    const {user } = useAuth();
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
          <div className="max-w-2xl text-center">
            <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-3 text-lg text-gray-600">
              Hello, <strong>{user.fullName}</strong>. You have admin privileges.
            </p>
            <div className="mt-6 space-x-4">
              <Link
                to="/profile"
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                View Profile
              </Link>
              <Link
                to="/admin/manage-users"
                className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
              >
                Manage Users
              </Link>
            </div>
          </div>
        </div>
      );
}

export default AdminDashbord