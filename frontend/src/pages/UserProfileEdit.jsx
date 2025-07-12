// src/pages/UserProfileEdit.jsx
import { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
  CircularProgress,
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
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState(null);   // null until fetched
  const [saved, setSaved] = useState(true); // disables Save when no changes
  const [loading, setLoading] = useState(true); // loader while fetching

  /* ------- fetch current profile ------- */
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const { data } = await api.get('/users/me');

        if (!data) {
          console.error('No user data returned from /users/me');
          setForm({
            name: '',
            location: '',
            skillsOffered: [],
            skillsWanted: [],
            availability: '',
            isPublic: false,
            photo: '',
            skillsOfferedText: '',
            skillsWantedText: '',
          });
        } else {
          setForm({
            ...data,
            skillsOfferedText: arrayString(data.skillsOffered || []),
            skillsWantedText: arrayString(data.skillsWanted || []),
          });
        }
      } catch (err) {
        console.error('Failed to fetch user profile', err.response?.data || err.message);
        alert('Error loading profile');
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [user]);

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography mt={2}>Loading profile...</Typography>
      </Container>
    );
  }

  if (!form) return null;

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
      const { data } = await api.patch('/users/me', payload);
      updateUser(data); // ✅ update AuthContext user
      setForm({
        ...data,
        skillsOfferedText: arrayString(data.skillsOffered || []),
        skillsWantedText: arrayString(data.skillsWanted || []),
      });
      setSaved(true);
      alert('Profile updated!');
    } catch (err) {
      console.error('Failed to save profile', err.response?.data || err.message);
      alert('Failed to save profile');
    }
  };

  const handleDiscard = async () => {
    setSaved(true);
    try {
      const { data } = await api.get('/users/me');
      setForm({
        ...data,
        skillsOfferedText: arrayString(data.skillsOffered || []),
        skillsWantedText: arrayString(data.skillsWanted || []),
      });
    } catch (err) {
      console.error('Failed to discard changes', err.response?.data || err.message);
      alert('Failed to reload profile');
    }
  };

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
          <Button
            variant="text"
            color="error"
            disabled={saved}
            onClick={handleDiscard}
          >
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
          <Avatar src={form.photo}>{form.name?.[0] || '?'}</Avatar>
        </IconButton>
      </Stack>

      <Box border={1} borderColor="grey.300" borderRadius={2} p={4}>
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

          {/* Profile Photo */}
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
