import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider.jsx';
import { Stack } from '@mui/material';


import {
  Avatar,
  Box,
  Button,
  Container,
  Link,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, logout } = useAuth();


  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Stack direction="row" spacing={2} mb={3} justifyContent="center">
              <Button component={RouterLink} to="/" variant="outlined">
                Home
              </Button>
              <Button component={RouterLink} to="/search" variant="outlined">
                Search
              </Button>
              <Button component={RouterLink} to="/swaps" variant="outlined">
                Swaps
              </Button>
              <Button component={RouterLink} to="/admin" variant="outlined">
                Admin
              </Button>
              <Button component={RouterLink} to="/users/1" variant="outlined">
                Demo Profile
              </Button>
              <Button
                color="error"
                variant="contained"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
              >
                Logout
              </Button>
            </Stack>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">Skill Swap Platform</Typography>
          <Button size="small" component={RouterLink} to="/" variant="outlined">
            Home
          </Button>
        </Box>

        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Avatar sx={{ bgcolor: 'primary.main', m: '0 auto' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h5" sx={{ mt: 1 }}>
            User Login
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            fullWidth
            label="Email Address"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <TextField
            margin="normal"
            fullWidth
            type="password"
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, borderRadius: 5 }}
          >
            Login
          </Button>

          <Link
            component={RouterLink}
            to="#"
            variant="body2"
            display="block"
            textAlign="center"
          >
            Forgot username / password?
          </Link>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
