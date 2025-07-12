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
import { useAuth } from '../context/AuthProvider';

/* ---------- Status helpers ---------- */
const statusColor = {
  pending: 'warning',
  accepted: 'success',
  rejected: 'error',
};

const capital = (s) => s[0].toUpperCase() + s.slice(1);



const SwapCard = ({ swap, onAccept, onReject }) => {
  const { user } = useAuth(); // get current logged-in user
  const { fromUser, toUser, offeredSkill, requestedSkill, status } = swap;

  // Defensive check to avoid null/undefined errors
  const toUserId = typeof toUser === 'string' ? toUser : toUser?._id;
const isReceiver = true;
console.log('user._id:', user?._id);
console.log('toUser:', toUser);
console.log('isReceiver:', isReceiver);


  return (
    <Paper
      elevation={1}
      sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}
    >
      <Avatar
        src={fromUser?.photoUrl || ''}
        alt={fromUser?.name || 'User'}
        sx={{ width: 64, height: 64 }}
      />
      <Box flexGrow={1}>
        <Typography variant="h6">{fromUser?.name || 'Unknown User'}</Typography>

        <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
          <Chip label={offeredSkill} size="small" color="success" />
          <Typography variant="body2">⇄</Typography>
          <Chip label={requestedSkill} size="small" color="primary" />
        </Stack>

        <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
          rating {fromUser?.rating?.toFixed(1) || 'N/A'}/5
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

        {status === 'pending' && isReceiver && (
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              onClick={() => onAccept(swap)}
              color="success"
              variant="contained"
            >
              Accept
            </Button>
            <Button
              size="small"
              onClick={() => onReject(swap)}
              color="error"
              variant="outlined"
            >
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
      try {
        const { data } = await api.get('/swaps/my');
        setSwaps(data); // data should be an array of swaps
      } catch (err) {
        console.error('Failed to fetch swaps', err);
      }
    };
    fetchSwaps();
  }, []);

  /* -------- handlers -------- */
  const updateStatus = async (swap, status) => {
    try {
      await api.patch(`/swaps/${swap._id}/status`, { status });
      setSwaps((prev) =>
        prev.map((s) =>
          s._id === swap._id ? { ...s, status } : s
        )
      );
    } catch (err) {
      console.error('Failed to update swap status', err);
      alert('Could not update swap status');
    }
  };

  const handleAccept = (swap) => updateStatus(swap, 'accepted');
  const handleReject = (swap) => updateStatus(swap, 'rejected');

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
        <Typography variant="h6">Swap Requests</Typography>
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
        {visible.length ? (
          visible.map((s) => (
            <SwapCard
              key={s._id}
              swap={s}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          ))
        ) : (
          <Typography>No swap requests found.</Typography>
        )}
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
