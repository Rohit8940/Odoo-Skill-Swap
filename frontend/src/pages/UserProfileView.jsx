import { Container, Avatar, Typography, Stack, Chip, Box, Button, Card, CardContent, Divider } from '@mui/material';
import { useAuth } from '../context/AuthProvider';
import { Link as RouterLink } from 'react-router-dom';

const UserProfileView = () => {
  const { user } = useAuth();

  if (user === undefined) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">Loading profile...</Typography>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>You are not logged in</Typography>
        <Button
          component={RouterLink}
          to="/login"
          variant="contained"
          color="primary"
          size="large"
        >
          Login
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Card elevation={4} sx={{ borderRadius: 3 }}>
        <CardContent>
          {/* Profile photo */}
          <Stack alignItems="center" spacing={2}>
            <Avatar
              src={user.photo}
              alt={user.name}
              sx={{
                width: 140,
                height: 140,
                boxShadow: 3,
                border: '4px solid #1976d2',
              }}
            >
              {user.name?.[0] || '?'}
            </Avatar>
            <Typography variant="h4" gutterBottom>{user.name}</Typography>
            <Typography variant="body1" color="text.secondary">
              📍 {user.location || 'No location specified'}
            </Typography>
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* Skills Offered */}
          <Box mb={2}>
            <Typography variant="h6" color="primary" gutterBottom>Skills Offered</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {user.skillsOffered?.length ? (
                user.skillsOffered.map((skill, idx) => (
                  <Chip key={idx} label={skill} color="success" variant="filled" />
                ))
              ) : (
                <Typography color="text.secondary">No skills offered</Typography>
              )}
            </Stack>
          </Box>

          {/* Skills Wanted */}
          <Box mb={2}>
            <Typography variant="h6" color="primary" gutterBottom>Skills Wanted</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {user.skillsWanted?.length ? (
                user.skillsWanted.map((skill, idx) => (
                  <Chip key={idx} label={skill} color="info" variant="filled" />
                ))
              ) : (
                <Typography color="text.secondary">No skills wanted</Typography>
              )}
            </Stack>
          </Box>

          {/* Availability */}
          <Box mb={2}>
            <Typography variant="h6" color="primary" gutterBottom>Availability</Typography>
            <Typography variant="body2" color="text.secondary">
              {user.availability || 'Not specified'}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Edit Button */}
          <Stack alignItems="center">
            <Button
              component={RouterLink}
              to="/profile"
              variant="contained"
              color="primary"
              size="large"
            >
              Edit Profile
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserProfileView;
