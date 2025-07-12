import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Link as RouterLink } from 'react-router-dom';

const Navbar = () => (
  <AppBar position="static" color="primary">
    <Toolbar>
      <Typography
        variant="h6"
        component={RouterLink}
        to="/"
        sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
      >
        Skill Swap Platform
      </Typography>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button color="inherit" component={RouterLink} to="/search">
          Search
        </Button>
        <Button color="inherit" component={RouterLink} to="/swaps">
          Swaps
        </Button>
        <Button color="inherit" component={RouterLink} to="/admin">
          Admin
        </Button>
      </Box>
    </Toolbar>
  </AppBar>
);

export default Navbar;
