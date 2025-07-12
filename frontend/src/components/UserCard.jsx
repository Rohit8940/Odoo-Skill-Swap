// src/components/UserCard.jsx
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Stack,
  Typography,
} from '@mui/material';

const SkillChip = ({ label, color }) => (
  <Chip
    label={label}
    size="small"
    variant="outlined"
    sx={{ mr: 0.5, mb: 0.5 }}
    color={color}
  />
);

const UserCard = ({ user, onRequest, disabled }) => {
  const navigate = useNavigate();

  const {
    _id,
    name,
    photoUrl,
    skillsOffered = [],
    skillsWanted = [],
    rating = 0,
  } = user;

  const handleCardClick = () => {
    navigate(`/users/${_id}`);
  };

  const handleRequest = (e) => {
    e.stopPropagation(); // prevent card click
    if (onRequest) onRequest(user);
  };

  return (
    <Box
      onClick={handleCardClick}
      sx={{
        border: 1,
        borderColor: 'grey.300',
        borderRadius: 2,
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        cursor: 'pointer',
        '&:hover': { backgroundColor: 'grey.100' },
      }}
    >
      {/* Avatar */}
      <Avatar
        src={photoUrl}
        alt={name}
        sx={{ width: 72, height: 72, flexShrink: 0 }}
      />

      {/* User info */}
      <Box flexGrow={1}>
        <Typography variant="h6">{name}</Typography>

        <Typography variant="subtitle2" sx={{ color: 'green', mt: 1 }}>
          Skills Offered →
        </Typography>
        <Stack direction="row" flexWrap="wrap">
          {skillsOffered.map((s) => (
            <SkillChip key={s} label={s} color="success" />
          ))}
        </Stack>

        <Typography variant="subtitle2" sx={{ color: 'blue', mt: 1 }}>
          Skills Wanted →
        </Typography>
        <Stack direction="row" flexWrap="wrap">
          {skillsWanted.map((s) => (
            <SkillChip key={s} label={s} color="primary" />
          ))}
        </Stack>

        <Typography
          variant="caption"
          sx={{ display: 'block', mt: 1, color: 'text.secondary' }}
        >
          Rating: {rating.toFixed(1)}/5
        </Typography>
      </Box>

      {/* Request button */}
      <Button
        variant="contained"
        color="info"
        onClick={handleRequest}
        disabled={disabled}
      >
        Request
      </Button>
    </Box>
  );
};

export default UserCard;
