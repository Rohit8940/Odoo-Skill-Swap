// src/pages/UserProfileEdit.jsx
import { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import api from '../services/api';
import { useAuth } from '../context/AuthProvider.jsx';

const commaArray = (str = '') =>
  str
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

const arrayString = (arr = []) => arr.join(', ');

const UserProfileEdit = () => {
  const { user } = useAuth();
  const [form, setForm] = useState(null);   // null until fetch
  const [saved, setSaved] = useState(true); // to enable/disable Save

  /* ------- fetch current profile ------- */
  useEffect(() => {
    const fetchMe = async () => {
      // const { data } = await api.get('/users/me');
      // mock for demo
      const data = {
        name: user?.name || '',
        location: 'Berlin',
        skillsOffered: ['JavaScript', 'Python'],
        skillsWanted: ['Graphic design'],
        availability: 'weekends',
        isPublic: true,
        photo: '', // url or base64
      };
      setForm({
        ...data,
        skillsOfferedText: arrayString(data.skillsOffered),
        skillsWantedText: arrayString(data.skillsWanted),
      });
    };
    fetchMe();
  }, [user]);

  if (!form) return null; // or loader

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setSaved(false);
  };

  const handleSave = async () => {
    const payload = {
      ...form,
      skillsOffered: commaArray(form.skillsOfferedText),
      skillsWanted: commaArray(form.skillsWantedText),
    };
    try {
      await api.put('/users/me', payload);
      setSaved(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDiscard = async () => {
    setSaved(true);
    // refetch from server
    const { data } = await api.get('/users/me');
    setForm({
      ...data,
      skillsOfferedText: arrayString(data.skillsOffered),
      skillsWantedText: arrayString(data.skillsWanted),
    });
  };

  /* ------- UI ------- */
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Top nav row */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Stack direction="row" spacing={2}>
          <Button
            variant="text"
            color="success"
            disabled={saved}
            onClick={handleSave}
          >
            Save
          </Button>
          <Button variant="text" color="error" disabled={saved} onClick={handleDiscard}>
            Discard
          </Button>
          <Button component={RouterLink} to="/swaps" variant="text">
            Swap request
          </Button>
          <Button component={RouterLink} to="/" variant="text">
            Home
          </Button>
        </Stack>
        <IconButton>
          <Avatar src={form.photo}>{form.name?.[0]}</Avatar>
        </IconButton>
      </Stack>

      <Box border={1} borderColor="grey.300" borderRadius={2} p={4}>
        {/* left column labels – right column inputs */}
        <Stack spacing={3}>
          {/* Name */}
          <TextField
            label="Name"
            fullWidth
            value={form.name}
            onChange={handleChange('name')}
          />

          {/* Location */}
          <TextField
            label="Location"
            fullWidth
            value={form.location}
            onChange={handleChange('location')}
          />

          {/* Skills Offered */}
          <TextField
            label="Skills Offered (comma separated)"
            fullWidth
            value={form.skillsOfferedText}
            onChange={handleChange('skillsOfferedText')}
          />

          {/* Skills Wanted */}
          <TextField
            label="Skills Wanted (comma separated)"
            fullWidth
            value={form.skillsWantedText}
            onChange={handleChange('skillsWantedText')}
          />

          {/* Availability */}
          <FormControl fullWidth>
            <InputLabel id="avail-label">Availability</InputLabel>
            <Select
              labelId="avail-label"
              value={form.availability}
              label="Availability"
              onChange={handleChange('availability')}
            >
              <MenuItem value="weekdays">Weekdays</MenuItem>
              <MenuItem value="weekends">Weekends</MenuItem>
              <MenuItem value="evenings">Evenings</MenuItem>
            </Select>
          </FormControl>

          {/* Profile visibility */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography>Profile Public</Typography>
            <Switch
              checked={form.isPublic}
              onChange={(e) => {
                setForm({ ...form, isPublic: e.target.checked });
                setSaved(false);
              }}
            />
          </Stack>

          {/* Profile Photo placeholder */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              src={form.photo}
              sx={{ width: 100, height: 100 }}
            />
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              component="label"
            >
              Add/Edit Photo
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  // TODO: handle upload; for now just show filename
                  const file = e.target.files[0];
                  if (file) {
                    setForm({ ...form, photo: URL.createObjectURL(file) });
                    setSaved(false);
                  }
                }}
              />
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
};

export default UserProfileEdit;
