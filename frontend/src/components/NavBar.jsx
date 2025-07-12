import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider.jsx';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
        >
          Skill Swap Platform
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          
          <Button color="inherit" component={RouterLink} to="/swaps">
            Swaps
          </Button>
          <Button color="inherit" component={RouterLink} to="/admin">
            Admin
          </Button>

       
          <IconButton
            component={RouterLink}
            to="/my-profile"
            color="inherit"
            sx={{ ml: 1 }}
          >
            {user && user.photo ? (
              <Avatar src={user.photo} alt={user.name || 'Profile'} />
            ) : (
              <AccountCircleIcon fontSize="large" />
            )}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
