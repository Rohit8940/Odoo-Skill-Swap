// src/pages/SwapRequests.jsx
import { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import api from '../services/api'; // axios instance

/* ---------- Status helpers ---------- */
const statusColor = {
  pending: 'warning',
  accepted: 'success',
  rejected: 'error',
};

const capital = (s) => s[0].toUpperCase() + s.slice(1);

const SwapCard = ({ swap, onAccept, onReject }) => {
  const { fromUser, offeredSkill, requestedSkill, status } = swap;

  return (
    <Paper
      elevation={1}
      sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}
    >
      <Avatar src={fromUser.photo} alt={fromUser.name} sx={{ width: 64, height: 64 }} />
      <Box flexGrow={1}>
        <Typography variant="h6">{fromUser.name}</Typography>

        <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
          <Chip label={offeredSkill} size="small" color="success" />
          <Typography variant="body2">⇄</Typography>
          <Chip label={requestedSkill} size="small" color="primary" />
        </Stack>

        <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
          rating {fromUser.rating.toFixed(1)}/5
        </Typography>
      </Box>

      {/* Status / actions */}
      <Stack spacing={1} alignItems="flex-end">
        <Chip
          label={capital(status)}
          color={statusColor[status]}
          size="small"
          variant="outlined"
        />

        {status === 'pending' && (
          <Stack direction="row" spacing={1}>
            <Button size="small" onClick={() => onAccept(swap)} color="success">
              Accept
            </Button>
            <Button size="small" onClick={() => onReject(swap)} color="error">
              Reject
            </Button>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};

const SwapRequests = () => {
  /* -------- state -------- */
  const [swaps, setSwaps] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 3;

  /* -------- fetch swaps -------- */
  useEffect(() => {
    const fetchSwaps = async () => {
      // real call: const { data } = await api.get('/swaps/my')
      const mock = [
        {
          id: 1,
          fromUser: {
            name: 'Marc Demo',
            photo: '',
            rating: 3.9,
          },
          offeredSkill: 'JavaScript',
          requestedSkill: 'Graphic design',
          status: 'pending',
        },
        {
          id: 2,
          fromUser: {
            name: 'Alice',
            photo: '',
            rating: 4.5,
          },
          offeredSkill: 'Python',
          requestedSkill: 'Photoshop',
          status: 'rejected',
        },
      ];
      setSwaps(mock);
    };
    fetchSwaps();
  }, []);

  /* -------- handlers -------- */
  const updateStatus = async (swap, status) => {
    // await api.patch(/swaps/${swap.id}/status, { status })
    setSwaps((prev) =>
      prev.map((s) => (s.id === swap.id ? { ...s, status } : s))
    );
  };

  /* -------- derived list -------- */
  const filtered = swaps.filter(
    (s) =>
      (filter === 'all' || s.status === filter) &&
      `${s.fromUser.name} ${s.offeredSkill} ${s.requestedSkill}`
  .toLowerCase()
  .includes(search.toLowerCase())

  );

  const pageCount = Math.ceil(filtered.length / pageSize);
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Top bar */}
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h6">Skill Swap Platform</Typography>
        <Button component={RouterLink} to="/" variant="text">
          Home
        </Button>
      </Stack>

      {/* Filter row */}
      <Stack direction="row" spacing={2} mb={3}>
        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            value={filter}
            label="Status"
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
            size="small"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="accepted">Accepted</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </FormControl>

        <TextField
          placeholder="Search..."
          size="small"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          fullWidth
        />
      </Stack>

      {/* swap list */}
      <Stack spacing={3}>
        {visible.map((s) => (
          <SwapCard
            key={s.id}
            swap={s}
            onAccept={() => updateStatus(s, 'accepted')}
            onReject={() => updateStatus(s, 'rejected')}
          />
        ))}
      </Stack>

      {/* pagination */}
      {pageCount > 1 && (
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, v) => setPage(v)}
            shape="rounded"
            siblingCount={1}
          />
        </Box>
      )}
    </Container>
  );
};

export default SwapRequests;