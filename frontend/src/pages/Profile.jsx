import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log("🧠 Profile user:", user);
  }, [user]);

  if (loading) {
    return <div className="text-center py-20 text-lg">Loading profile...</div>;
  }

  if (!user) {
    return <div className="text-center py-20 text-red-500">User not found or not logged in.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Cover Image */}
        <div className="w-full h-48 bg-gray-300 relative">
          {user.coverImage ? (
            <img
              src={user.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-400 to-indigo-500"></div>
          )}
        </div>

        {/* Profile Info */}
        <div className="relative px-6 py-10 md:px-10">
          <div className="absolute -top-16 left-6 md:left-10">
            <div className="h-32 w-32 rounded-full ring-4 ring-white bg-gray-200 overflow-hidden">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-blue-500 text-white text-2xl font-bold">
                  {user.fullName}
                </div>
              )}
            </div>
          </div>

          {/* User Details */}
          <div className="mt-16">
            <h1 className="text-3xl font-bold text-gray-900">{user.fullName}</h1>
            <p className="text-gray-500 mt-1">@{user.username}</p>

            <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-lg font-medium text-gray-900">{user.email}</p>
              </div>

              {user.createdAt && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Joined</p>
                  <p className="text-lg font-medium text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
