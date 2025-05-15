import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashbord from './pages/admin/AdminDashbord';
import UserDeshbord from './pages/user/UserDashbord';
<<<<<<< HEAD
=======
import AuthSuccess from './pages/AuthSuccess';
import ChangePassword from './pages/ChangePassword';
>>>>>>> Resolved merge conflicts

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
<<<<<<< HEAD
=======
              <Route path="/user" element={<UserDeshbord/>} />
              
>>>>>>> Resolved merge conflicts
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
<<<<<<< HEAD
              
=======
              <Route 
                path="/change-password" 
                element={
                  <ProtectedRoute>
                    <ChangePassword />
                  </ProtectedRoute>
                } 
              />
              <Route path="/auth/success" element={<AuthSuccess/>} />

>>>>>>> Resolved merge conflicts
            </Routes>
            
          </main>
          <Toaster position="top-right" />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;