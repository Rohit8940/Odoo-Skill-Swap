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
  Typography,
  IconButton,
  Avatar,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider.jsx';
import UserCard from '../components/UserCard.jsx';
import api from '../services/api';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const pageSize = 5;

const Home = () => {
  const [availability, setAvailability] = useState('');
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/users', {
          params: { skill: query, availability, page, limit: pageSize },
        });
        setUsers(data.users || []);
        setTotal(data.total || 0);
      } catch (err) {
        console.error('Fetch users failed', err.response?.data || err.message);
      }
    };
    fetchUsers();
  }, [query, availability, page]);

  const handleRequestSwap = async (toUser) => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (!user?.skillsOffered || user.skillsOffered.length === 0) {
      alert('Please add at least one skill in your profile first.');
      navigate('/profile');
      return;
    }
    const offeredSkill = user.skillsOffered[0];
    const requestedSkill = toUser.skillsWanted?.[0] || '';

    if (!requestedSkill) {
      alert('Target user has no skills wanted listed.');
      return;
    }

    try {
      await api.post('/swaps', {
        toUser: toUser._id,
        offeredSkill,
        requestedSkill,
      });
      alert('Swap request sent!');
    } catch (err) {
      console.error('Swap request failed', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Swap request failed');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const pageCount = Math.ceil(total / pageSize);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* NAV BUTTONS */}
      <Stack direction="row" spacing={2} mb={3} alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={2}>
          <Button component={RouterLink} to="/" variant="outlined">
            Home
          </Button>
         
          <Button component={RouterLink} to="/swaps" variant="outlined">
            Swaps
          </Button>
          <Button component={RouterLink} to="/admin" variant="outlined">
            Admin
          </Button>
          <Button
            onClick={() => navigate('/profile')}
            variant="outlined"
          >
            Demo Profile
          </Button>
        </Stack>

        {/* Profile icon + Logout */}
        <Stack direction="row" spacing={2} alignItems="center">
         <IconButton
  component={RouterLink}
  to={token ? "/my-profile" : "/login"} // 🔥 if logged in → profile, else → login
  color="primary"
>
  {user?.photo ? (
    <Avatar src={user.photo} />
  ) : (
    <AccountCircleIcon fontSize="large" />
  )}
</IconButton>

          {token ? (
            <Button
              color="error"
              variant="contained"
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <Button variant="contained" onClick={() => navigate('/login')}>
              Login
            </Button>
          )}
        </Stack>
      </Stack>

      {/* Filter + search */}
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
        {users.filter((u) => u._id !== user?._id).length === 0 ? (
          <Typography variant="body1">No users found.</Typography>
        ) : (
          users
            .filter((u) => u._id !== user?._id)
            .map((u) => (
              <UserCard
                key={u._id}
                user={u}
                onRequest={() => handleRequestSwap(u)}
                disabled={!token}
              />
            ))
        )}
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
