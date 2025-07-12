// src/pages/Search.jsx
import { useEffect, useState } from 'react';
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
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import UserCard from '../components/UserCard.jsx';
import api from '../services/api';

const Search = () => {
  const [availability, setAvailability] = useState('');
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    const fetchUsers = async () => {
      // real: const { data } = await api.get('/users', { params: { skill: query, availability } });
      const mock = [
        { id: 1, name: 'Marc Demo', photo: '', skillsOffered: ['JavaScript'], skillsWanted: ['Photoshop'], rating: 3.9 },
        { id: 2, name: 'Michell', photo: '', skillsOffered: ['Python'], skillsWanted: ['Graphic design'], rating: 2.5 },
        { id: 3, name: 'Joe Wills', photo: '', skillsOffered: ['C++'], skillsWanted: ['Guitar'], rating: 4.0 },
      ];
      setUsers(mock);
    };
    fetchUsers();
  }, [query, availability]);

  const filtered = users.filter(
    (u) =>
      (!query ||
        [...u.skillsOffered, ...u.skillsWanted]
          .join(' ')
          .toLowerCase()
          .includes(query.toLowerCase())) &&
      (!availability || u.availability === availability)
  );

  const pageCount = Math.ceil(filtered.length / pageSize);
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h6">Skill Swap Platform - Search</Typography>
        <Button component={RouterLink} to="/" variant="text">
          Home
        </Button>
      </Stack>

      {/* Filters */}
      <Stack direction="row" spacing={2} mb={4}>
        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel id="avail-label">Availability</InputLabel>
          <Select
            labelId="avail-label"
            value={availability}
            label="Availability"
            size="small"
            onChange={(e) => {
              setAvailability(e.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="">Any</MenuItem>
            <MenuItem value="weekends">Weekends</MenuItem>
            <MenuItem value="evenings">Evenings</MenuItem>
          </Select>
        </FormControl>

        <TextField
          placeholder="Search skills..."
          size="small"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          fullWidth
        />
      </Stack>

      {/* Results */}
      <Stack spacing={3}>
        {visible.map((u) => (
          <UserCard
            key={u.id}
            user={u}
            onRequest={() => {}}      /* no request button in search page */
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
            shape="rounded"
          />
        </Box>
      )}
    </Container>
  );
};

export default Search;
