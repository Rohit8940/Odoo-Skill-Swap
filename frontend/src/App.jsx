// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthProvider.jsx';
import Login from './pages/Login.jsx';

const App = () => (
  <AuthProvider>
    <Routes>
      <Route path="/*" element={<Login />} />
    </Routes>
  </AuthProvider>
);

export default App;
