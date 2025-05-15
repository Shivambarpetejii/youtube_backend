import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import OtpInput from 'react-otp-input';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const { isAuthenticated } = useAuth();
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();


  const handleSendOtp = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:9000/api/v1/users/sendotp', {}, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setIsOtpSent(true);
        toast.success('OTP sent successfully to your email');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
      console.error('Error sending OTP:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (!oldPassword || !newPassword || !otp) {
      return toast.error('All fields are required');
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        'http://localhost:9000/api/v1/users/change-password',
        {
          oldPassword,
          newPassword,
          otp
        },
        {
          withCredentials: true
        }
      );
       
      if (response.data.success) {
        toast.success('Password changed successfully');
      
        setIsOtpSent(false);
        setOldPassword('');
        setNewPassword('');
        setOtp('');
        navigate('/login')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
      console.error('Error changing password:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
        <p className="text-center text-red-500">Please login to access this page</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Change Password</h1>

      {!isOtpSent ? (
        <div className="text-center">
          <p className="mb-4">Click the button below to receive a one-time password (OTP) on your registered email.</p>
          <button
            onClick={handleSendOtp}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            {isLoading ? 'Sending...' : 'Send OTP'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleChangePassword}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="oldPassword">
              Current Password
            </label>
            <input
              id="oldPassword"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your current password"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="newPassword">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your new password"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">
              Enter OTP
            </label>
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => 
                <input 
                  {...props} 
                  className="!w-10 h-10 border-2 rounded mx-1 text-center" 
                />
              }
              containerStyle="flex justify-center"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            {isLoading ? 'Processing...' : 'Change Password'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ChangePassword;