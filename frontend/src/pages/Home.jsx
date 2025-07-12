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
import UserCard from '../components/UserCard.jsx';
import api from '../services/api'; // <-- axios instance w/ JWT

const Home = () => {
  /* ------------ state ------------ */
  const [availability, setAvailability] = useState('');
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 5; // users per page

  /* ------------ fetch users ------------ */
  useEffect(() => {
    const fetchUsers = async () => {
      // call backend: /api/users?skill=query&availability=availability
      // For now, mock data:
      const mock = [
        {
          id: 1,
          name: 'Marc Demo',
          photo: '',
          skillsOffered: ['JavaScript', 'Python'],
          skillsWanted: ['Photoshop', 'Graphic design'],
          rating: 3.9,
        },
        {
          id: 2,
          name: 'Michell',
          photo: '',
          skillsOffered: ['JavaScript', 'Python'],
          skillsWanted: ['Photoshop', 'Graphic design'],
          rating: 2.5,
        },
        {
          id: 3,
          name: 'Joe Wills',
          photo: '',
          skillsOffered: ['JavaScript', 'Python'],
          skillsWanted: ['Photoshop', 'Graphic design'],
          rating: 4.0,
        },
      ];
      setUsers(mock);
      // In real app:
      // const { data } = await api.get('/users', { params: { skill: query, availability } })
      // setUsers(data)
    };
    fetchUsers();
  }, [query, availability]);

  /* ------------ handlers ------------ */
  const handleRequestSwap = (user) => {
    console.log('Request swap with', user.name);
    // POST /api/swaps with user.id
  };

  const pageCount = Math.ceil(users.length / pageSize);
  const paginated = users.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Filter + search bar */}
      <Stack direction="row" spacing={2} mb={4}>
        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel id="avail-label">Availability</InputLabel>
          <Select
            labelId="avail-label"
            value={availability}
            label="Availability"
            onChange={(e) => setAvailability(e.target.value)}
            size="small"
          >
            <MenuItem value="">Any</MenuItem>
            <MenuItem value="weekends">Weekends</MenuItem>
            <MenuItem value="evenings">Evenings</MenuItem>
          </Select>
        </FormControl>

        <TextField
          placeholder="Search skills..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="small"
          fullWidth
        />

        <Button
          variant="contained"
          onClick={() => {
            /* trigger useEffect because query already updated */
          }}
        >
          Search
        </Button>
      </Stack>

      {/* User list */}
      <Stack spacing={3}>
        {paginated.map((u) => (
          <UserCard key={u.id} user={u} onRequest={handleRequestSwap} />
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
