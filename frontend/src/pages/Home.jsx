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
  Paper,
  AppBar,
  Toolbar,
  Badge,
  useTheme,
  useMediaQuery,
  Divider,
  Chip
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider.jsx';
import UserCard from '../components/UserCard.jsx';
import api from '../services/api';
import {
  AccountCircle,
  Search,
  Notifications,
  Logout,
  Login,
  Home as HomeIcon,
  SwapHoriz,
  AdminPanelSettings,
  Person
} from '@mui/icons-material';

const pageSize = 5;

const Home = () => {
  const [availability, setAvailability] = useState('');
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [notificationCount, setNotificationCount] = useState(3); // Mock count

  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
  position="sticky"
  elevation={1}
  color="default" // ✅ changed from background.paper
  sx={{ borderBottom: 1, borderColor: 'divider' }}
>
  <Toolbar>
    <Typography
      variant="h6"
      component="div"
      sx={{ flexGrow: 1, color: 'primary.main', fontWeight: 600 }}
    >
      SkillSwap
    </Typography>

    {/* Search on desktop */}
    {!isMobile && (
      <Paper
        component="form"
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: 300,
          mx: 2,
        }}
        elevation={0}
      >
        <TextField
          fullWidth
          placeholder="Search skills..."
          variant="standard"
          size="small"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          InputProps={{
            disableUnderline: true,
          }}
          sx={{ ml: 1, flex: 1 }}
        />
        <IconButton type="submit" sx={{ p: '10px' }} color="primary">
          <Search />
        </IconButton>
      </Paper>
    )}

    {/* Navigation */}
    <Stack direction="row" spacing={1} alignItems="center">
      {token && (
        <IconButton
          color="primary" // ✅ explicit color
          onClick={() => navigate('/swaps')}
        >
          <Badge badgeContent={notificationCount} color="error">
            <Notifications />
          </Badge>
        </IconButton>
      )}

      <IconButton
        component={RouterLink}
        to={token ? "/my-profile" : "/login"}
        color="primary" // ✅ explicit color
      >
        {user?.photo ? (
          <Avatar
            src={user.photo}
            sx={{
              width: 32,
              height: 32,
              bgcolor: 'primary.main', // ✅ fallback bg
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            {user.name?.[0] || '?'}
          </Avatar>
        ) : (
          <AccountCircle />
        )}
      </IconButton>

      {token ? (
        <Button
          color="primary"
          startIcon={<Logout />}
          onClick={handleLogout}
          size="small"
        >
          {!isMobile && 'Logout'}
        </Button>
      ) : (
        <Button
          color="primary"
          startIcon={<Login />}
          onClick={() => navigate('/login')}
          size="small"
        >
          {!isMobile && 'Login'}
        </Button>
      )}
    </Stack>
  </Toolbar>
</AppBar>


      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        {/* Mobile Search */}
        {isMobile && (
          <Paper sx={{ p: 2, mb: 3 }}>
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                placeholder="Search skills..."
                variant="outlined"
                size="small"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
              />
              <Button variant="contained" onClick={() => setPage(1)}>
                <Search />
              </Button>
            </Stack>
          </Paper>
        )}

        {/* Sidebar + Content */}
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 3 }}>
          {/* Sidebar */}
          <Paper sx={{ p: 2, width: isMobile ? '100%' : 250, mb: isMobile ? 2 : 0 }}>
            <Stack spacing={2}>
              <Typography variant="h6" gutterBottom>
                Filters
              </Typography>
              
              <FormControl fullWidth size="small">
                <InputLabel id="avail-label">Availability</InputLabel>
                <Select
                  labelId="avail-label"
                  value={availability}
                  label="Availability"
                  onChange={(e) => {
                    setAvailability(e.target.value);
                    setPage(1);
                  }}
                >
                  <MenuItem value="">Any Availability</MenuItem>
                  <MenuItem value="weekdays">Weekdays</MenuItem>
                  <MenuItem value="weekends">Weekends</MenuItem>
                  <MenuItem value="evenings">Evenings</MenuItem>
                </Select>
              </FormControl>

              <Divider />

              <Typography variant="h6" gutterBottom>
                Quick Links
              </Typography>
              
              <Button
                variant="outlined"
                startIcon={<HomeIcon />}
                fullWidth
                onClick={() => navigate('/')}
              >
                Home
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<SwapHoriz />}
                fullWidth
                onClick={() => navigate('/swaps')}
              >
                My Swaps
              </Button>
              
              {user?.isAdmin && (
                <Button
                  variant="outlined"
                  startIcon={<AdminPanelSettings />}
                  fullWidth
                  onClick={() => navigate('/admin')}
                >
                  Admin
                </Button>
              )}
              
              <Button
                variant="outlined"
                startIcon={<Person />}
                fullWidth
                onClick={() => navigate('/profile')}
              >
               Edit Profile
              </Button>
              <Button
                variant="outlined"
                startIcon={<Person />}
                fullWidth
                onClick={() => navigate('/register')}
              >
               Sign Up
              </Button>
            </Stack>
          </Paper>

          {/* Main Content */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" gutterBottom>
              Available Skill Swappers
            </Typography>
            
            {users.filter((u) => u._id !== user?._id).length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No users found matching your criteria.
                </Typography>
                <Button variant="contained" sx={{ mt: 2 }} onClick={() => {
                  setQuery('');
                  setAvailability('');
                  setPage(1);
                }}>
                  Clear Filters
                </Button>
              </Paper>
            ) : (
              <Stack spacing={2}>
                {users
                  .filter((u) => u._id !== user?._id)
                  .map((u) => (
                    <UserCard
                      key={u._id}
                      user={u}
                      onRequest={() => handleRequestSwap(u)}
                      disabled={!token}
                    />
                  ))}
              </Stack>
            )}

            {/* Pagination */}
            {pageCount > 1 && (
              <Box mt={4} display="flex" justifyContent="center">
                <Pagination
                  count={pageCount}
                  page={page}
                  onChange={(_, v) => setPage(v)}
                  color="primary"
                  shape="rounded"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
          </Box>
        </Box>
      </Container>

      {/* Footer */}
      <Box component="footer" sx={{ bgcolor: 'background.paper', py: 3, mt: 'auto' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} SkillSwap. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;