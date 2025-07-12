// src/pages/UserProfile.jsx
import { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  Stack,
  Typography,
  Tooltip,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SwapRequestDialog from '../components/SwapRequestDialog.jsx';
import api from '../services/api';

const SkillChips = ({ skills, color }) => (
  <Stack direction="row" flexWrap="wrap" gap={0.5}>
    {skills.map((s) => (
      <Chip key={s} label={s} size="small" color={color} variant="outlined" />
    ))}
  </Stack>
);

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      // real call: const { data } = await api.get(`/users/${id}`);
      const data = {
        id,
        name: 'Marc Demo',
        photo: '',
        skillsOffered: ['JavaScript', 'Python'],
        skillsWanted: ['Photoshop', 'Graphic design'],
        rating: 3.9,
      };
      setUser(data);
    };
    fetchUser();
  }, [id]);

  if (!user) return null;

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      {/* top bar */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Skill Swap Platform</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button variant="text" component={RouterLink} to="/swaps">
            Swap request
          </Button>
          <IconButton component={RouterLink} to="/">
            <Tooltip title="Home">
              <HomeIcon />
            </Tooltip>
          </IconButton>
        </Stack>
      </Stack>

      {/* main card */}
      <Box border={1} borderColor="grey.300" borderRadius={2} p={3}>
        <Stack direction="row" gap={3} alignItems="center">
          <Avatar src={user.photo} alt={user.name} sx={{ width: 120, height: 120 }} />
          <Box flexGrow={1}>
            <Typography variant="h5" mb={1}>
              {user.name}
            </Typography>

            <Typography variant="subtitle2" color="green">
              Skills Offered
            </Typography>
            <SkillChips skills={user.skillsOffered} color="success" />

            <Typography variant="subtitle2" color="primary" sx={{ mt: 1 }}>
              Skills Wanted
            </Typography>
            <SkillChips skills={user.skillsWanted} color="primary" />

            <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
              rating {user.rating.toFixed(1)}/5
            </Typography>
          </Box>

          <Button variant="contained" color="info" onClick={() => setOpen(true)}>
            Request
          </Button>
        </Stack>
      </Box>

      {/* Swap‑request dialog */}
      <SwapRequestDialog
        open={open}
        onClose={() => setOpen(false)}
        targetUser={user}
      />
    </Container>
  );
};

export default UserProfile;
