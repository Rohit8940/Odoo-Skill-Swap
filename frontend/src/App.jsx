// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import AuthProvider, { useAuth } from './context/AuthProvider.jsx';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx'; // ⬅️ Import the new Home page

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Login />;
};

const App = () => (
  <AuthProvider>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
    </Routes>
  </AuthProvider>
);

export default App;
