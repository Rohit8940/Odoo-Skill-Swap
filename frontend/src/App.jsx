// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider, { useAuth } from './context/AuthProvider.jsx';

import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/Home.jsx';
import Search from './pages/Search.jsx';
import UserProfile from './pages/UserProfile.jsx';
import UserProfileEdit from './pages/UserProfileEdit.jsx';
import SwapRequests from './pages/SwapRequests.jsx';
import Admin from './pages/Admin.jsx';

/* ---------- Auth gate ---------- */
const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => (
  <AuthProvider>
    <Routes>
      {/* PUBLIC routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* You can leave /search public, or protect it—your choice */}
      <Route path="/search" element={<Search />} />

      {/* PROTECTED routes */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/users/:id"
        element={
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <UserProfileEdit />
          </PrivateRoute>
        }
      />
      <Route
        path="/swaps"
        element={
          <PrivateRoute>
            <SwapRequests />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <Admin />
          </PrivateRoute>
        }
      />
    </Routes>
  </AuthProvider>
);

export default App;
