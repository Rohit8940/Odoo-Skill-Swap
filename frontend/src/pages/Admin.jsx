// src/pages/Admin.jsx
import { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import api from '../services/api';

const Admin = () => {
  const [tab, setTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [swaps, setSwaps] = useState([]);

  /* ---- mock fetches ---- */
  useEffect(() => {
    setUsers([
      { id: 1, name: 'Alice', email: 'alice@test.com', isBanned: false },
      { id: 2, name: 'Bob', email: 'bob@test.com', isBanned: true },
    ]);
    setSwaps([
      { id: 101, from: 'Alice', to: 'Marc', status: 'pending' },
      { id: 102, from: 'Bob', to: 'Joe', status: 'rejected' },
    ]);
  }, []);

  /* ---- handlers ---- */
  const toggleBan = (user) => {
    // await api.patch(`/admin/users/${user.id}/ban`, { isBanned: !user.isBanned })
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, isBanned: !u.isBanned } : u))
    );
  };

  const updateSwap = (swap, status) => {
    // await api.patch(`/admin/swaps/${swap.id}`, { status })
    setSwaps((prev) =>
      prev.map((s) => (s.id === swap.id ? { ...s, status } : s))
    );
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Admin Dashboard</Typography>
        <Button component={RouterLink} to="/" variant="text">
          Home
        </Button>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Users" />
        <Tab label="Swaps" />
      </Tabs>

      {tab === 0 && (
        <Box display="flex" flexDirection="column" gap={2}>
          {users.map((u) => (
            <Paper key={u.id} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar>{u.name[0]}</Avatar>
              <Box flexGrow={1}>
                <Typography>{u.name}</Typography>
                <Typography variant="caption">{u.email}</Typography>
              </Box>
              <Chip
                label={u.isBanned ? 'Banned' : 'Active'}
                color={u.isBanned ? 'error' : 'success'}
                size="small"
                sx={{ mr: 2 }}
              />
              <Button
                size="small"
                variant="outlined"
                color={u.isBanned ? 'success' : 'error'}
                onClick={() => toggleBan(u)}
              >
                {u.isBanned ? 'Unban' : 'Ban'}
              </Button>
            </Paper>
          ))}
        </Box>
      )}

      {tab === 1 && (
        <Box display="flex" flexDirection="column" gap={2}>
          {swaps.map((s) => (
            <Paper key={s.id} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box flexGrow={1}>
                <Typography>
                  {s.from} ⇄ {s.to}
                </Typography>
              </Box>
              <Chip label={s.status} color={s.status === 'pending' ? 'warning' : s.status === 'accepted' ? 'success' : 'error'} />
              {s.status === 'pending' && (
                <>
                  <IconButton color="success" onClick={() => updateSwap(s, 'accepted')}>
                    <CheckIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => updateSwap(s, 'rejected')}>
                    <DeleteIcon />
                  </IconButton>
                </>
              )}
            </Paper>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default Admin;
