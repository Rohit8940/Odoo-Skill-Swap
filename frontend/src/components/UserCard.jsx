// src/components/UserCard.jsx
import {
  Avatar,
  Box,
  Button,
  Chip,
  Stack,
  Typography,
} from '@mui/material';

const SkillChip = ({ label, color = 'default' }) => (
  <Chip
    label={label}
    size="small"
    sx={{ mr: 0.5, mb: 0.5 }}
    color={color}
    variant="outlined"
  />
);

const UserCard = ({ user, onRequest }) => {
  const {
    name,
    photo,
    skillsOffered = [],
    skillsWanted = [],
    rating = 0,
  } = user;

  return (
    <Box
      border={1}
      borderColor="grey.300"
      borderRadius={2}
      p={2}
      display="flex"
      alignItems="center"
      gap={2}
    >
      {/* profile photo */}
      <Avatar
        src={photo}
        alt={name}
        sx={{ width: 72, height: 72, flexShrink: 0 }}
      />

      {/* middle section */}
      <Box flexGrow={1}>
        <Typography variant="h6">{name}</Typography>

        <Typography variant="subtitle2" sx={{ mt: 0.5, color: 'green.600' }}>
          Skills Offered →
        </Typography>
        <Stack direction="row" flexWrap="wrap">
          {skillsOffered.map((s) => (
            <SkillChip key={s} label={s} color="success" />
          ))}
        </Stack>

        <Typography variant="subtitle2" sx={{ mt: 1, color: 'blue.600' }}>
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
          rating {rating.toFixed(1)}/5
        </Typography>
      </Box>

      {/* Request button */}
      <Button
        variant="contained"
        color="info"
        onClick={() => onRequest(user)}
        sx={{ borderRadius: 3 }}
      >
        Request
      </Button>
    </Box>
  );
};

export default UserCard;
