// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthProvider.jsx';

import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import UserProfile from './pages/UserProfile.jsx';

// import any other pages you want to test
// import Search from './pages/Search.jsx';
// import Swaps from './pages/Swaps.jsx';
// import Admin from './pages/Admin.jsx';

const App = () => (
  <AuthProvider>
    <Routes>
      {/* Public routes for quick testing */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
      <Route path="/users/:id" element={<UserProfile />} />
      {/* <Route path="/search" element={<Search />} /> */}
      {/* <Route path="/admin"  element={<Admin />} /> */}
    </Routes>
  </AuthProvider>
);

export default App;
