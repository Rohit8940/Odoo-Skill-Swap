// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider.jsx';
import UserCard from '../components/UserCard.jsx';
import api from '../services/api';

const pageSize = 5; // constant

const Home = () => {
  /* ------------ state ------------ */
  const [availability, setAvailability] = useState('');
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  /* ------------ auth ------------ */
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  /* ------------ fetch users ------------ */
 useEffect(() => {
  console.log('Home mounted', { user, token });
  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users', {
        params: { skill: query, availability, page, limit: pageSize },
      });
      console.log('API /users response:', data);
      setUsers(data.users);
      setTotal(data.total);
    } catch (err) {
      console.error('Fetch users failed', err.response?.data || err.message);
    }
  };
  fetchUsers();
}, [query, availability, page]);


  /* ------------ handlers ------------ */
  const handleRequestSwap = async (toUser) => {
    if (!token) {
      // not logged in → redirect to login
      navigate('/login');
      return;
    }

    try {
      await api.post('/swaps', {
        toUser: toUser._id,
        offeredSkill: user?.skillsOffered?.[0] || 'N/A',   // TODO: pick real skill
        requestedSkill: toUser.skillsWanted?.[0] || 'N/A',
      });
      // optional: toast success
    } catch (err) {
      console.error('Swap request failed', err.response?.data || err.message);
    }
  };

  const pageCount = Math.ceil(total / pageSize);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* DEV NAV BUTTONS */}
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
       <Button
  component={RouterLink}
  to={users.length ? `/users/${users[0]._id}` : '/'}
  variant="outlined"
  disabled={!users.length}
>
  Demo Profile
</Button>

        {token ? (
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
        ) : (
          <Button
            variant="contained"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        )}
      </Stack>

      {/* Filter + search bar */}
      <Stack direction="row" spacing={2} mb={4}>
        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel id="avail-label">Availability</InputLabel>
          <Select
            labelId="avail-label"
            value={availability}
            label="Availability"
            onChange={(e) => {
              setAvailability(e.target.value);
              setPage(1);
            }}
            size="small"
          >
            <MenuItem value="">Any</MenuItem>
            <MenuItem value="weekdays">Weekdays</MenuItem>
            <MenuItem value="weekends">Weekends</MenuItem>
            <MenuItem value="evenings">Evenings</MenuItem>
          </Select>
        </FormControl>

        <TextField
          placeholder="Search skills..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          size="small"
          fullWidth
        />

        <Button variant="contained" onClick={() => setPage(1)}>
          Search
        </Button>
      </Stack>

      {/* User list */}
      <Stack spacing={3}>
        {users.map((u) => (
          <UserCard
            key={u._id}
            user={u}
            onRequest={() => handleRequestSwap(u)}
            disabled={!token}          // UserCard hides button if not logged‑in
          />
        ))}
      </Stack>

      {/* Pagination */}
      {pageCount > 1 && (
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, v) => setPage(v)}
            siblingCount={1}
            boundaryCount={1}
            shape="rounded"
          />
        </Box>
      )}
    </Container>
  );
};

export default Home;
