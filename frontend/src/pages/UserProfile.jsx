// src/pages/UserProfile.jsx
import { useEffect, useState } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

import { useAuth } from '../context/AuthProvider.jsx';
import SwapRequestDialog from '../components/SwapRequestDialog.jsx';
import api from '../services/api';

const SkillChips = ({ skills = [], color }) => (
  <Stack direction="row" flexWrap="wrap" gap={0.5}>
    {skills.length ? (
      skills.map((s) => (
        <Chip key={s} label={s} size="small" color={color} variant="outlined" />
      ))
    ) : (
      <Typography variant="caption">—</Typography>
    )}
  </Stack>
);

const UserProfile = () => {
  const { id } = useParams();          // could be undefined or "me"
  const navigate = useNavigate();
  const { user: current } = useAuth(); // logged‑in user from context
  const [profile, setProfile] = useState(null);
  const [open, setOpen] = useState(false);

  /* ---------- fetch or assign profile ---------- */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Case 1: viewing yourself
        if (!id || id === 'me' || id === current?._id) {
          setProfile(current);
          return;
        }

        // Case 2: viewing someone else
        const { data } = await api.get(`/users/${id}`);
        setProfile(data);
      } catch (err) {
        console.error(err.response?.data || err.message);
        navigate('/'); // fallback if user not found
      }
    };

    if (current) loadProfile();
  }, [id, current, navigate]);

  if (!profile) return null; // optionally add a loader

  const showRequestBtn = current && profile._id !== current._id;

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      {/* ─── top bar ─── */}
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

      {/* ─── profile card ─── */}
      <Box border={1} borderColor="grey.300" borderRadius={2} p={3}>
        <Stack direction="row" gap={3} alignItems="center">
          <Avatar
            src={profile.photoUrl}
            alt={profile.name}
            sx={{ width: 120, height: 120 }}
          />
          <Box flexGrow={1}>
            <Typography variant="h5">{profile.name}</Typography>
            <Typography variant="body2" color="text.secondary" mb={1}>
              {profile.email || '—'}
            </Typography>

            <Typography variant="subtitle2" color="green">
              Skills Offered
            </Typography>
            <SkillChips skills={profile.skillsOffered} color="success" />

            <Typography variant="subtitle2" color="primary" sx={{ mt: 1 }}>
              Skills Wanted
            </Typography>
            <SkillChips skills={profile.skillsWanted} color="primary" />

            <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
              rating {profile.rating ? profile.rating.toFixed(1) : '—'}/5
            </Typography>
          </Box>

          {showRequestBtn && (
            <Button variant="contained" color="info" onClick={() => setOpen(true)}>
              Request
            </Button>
          )}
        </Stack>
      </Box>

      {/* ─── swap request dialog ─── */}
      {showRequestBtn && (
        <SwapRequestDialog
          open={open}
          onClose={() => setOpen(false)}
          targetUser={profile}
        />
      )}
    </Container>
  );
};

export default UserProfile;
