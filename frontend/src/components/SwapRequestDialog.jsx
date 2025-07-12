// src/components/SwapRequestDialog.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Stack,
  FormHelperText,
} from '@mui/material';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthProvider.jsx';

const SwapRequestDialog = ({ open, onClose, targetUser }) => {
  const { user, setUser } = useAuth(); 
  const [mySkill, setMySkill] = useState('');
  const [theirSkill, setTheirSkill] = useState('');
  const [message, setMessage] = useState('');


  const [myOptions, setMyOptions] = useState([]);
  const [theirOptions, setTheirOptions] = useState([]);


  useEffect(() => {
    if (open) {
      setMyOptions(user?.skillsOffered || []);
      setTheirOptions(targetUser?.skillsWanted || []);
      setMySkill('');
      setTheirSkill('');
      setMessage('');
    }
  }, [open, user, targetUser]);


  const onMySkillChange = (_, val) => {
    if (val && !myOptions.includes(val)) setMyOptions((prev) => [...prev, val]);
    setMySkill(val);
  };
  const onTheirSkillChange = (_, val) => {
    if (val && !theirOptions.includes(val))
      setTheirOptions((prev) => [...prev, val]);
    setTheirSkill(val);
  };
const handleSubmit = async () => {
  try {
    
    if (!user.skillsOffered.includes(mySkill)) {
      await api.patch('/users/me', {
        $addToSet: { skillsOffered: mySkill },
      });
      
      setUser((prev) => ({
        ...prev,
        skillsOffered: [...(prev.skillsOffered || []), mySkill],
      }));
    }

    await api.post('/swaps', {
      toUser: targetUser._id,
      offeredSkill: mySkill,
      requestedSkill: theirSkill,
      message,
    });

 
    onClose();
  } catch (err) {
    console.error('Swap request failed', err.response?.data || err.message);
    alert(err.response?.data?.message || 'Swap request failed');
  }
};


  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Request a Skill Swap</DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3}>
         
          <Autocomplete
            freeSolo
            options={myOptions}
            value={mySkill}
            onChange={onMySkillChange}
            onInputChange={(_, val) => setMySkill(val)}
            renderInput={(params) => (
              <TextField {...params} label="Your offered skill" />
            )}
          />

      
          <Autocomplete
            freeSolo
            options={theirOptions}
            value={theirSkill}
            onChange={onTheirSkillChange}
            onInputChange={(_, val) => setTheirSkill(val)}
            renderInput={(params) => (
              <TextField {...params} label="Their wanted skill" />
            )}
          />

     
          <TextField
            label="Message (optional)"
            multiline
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
          />

  
          {!myOptions.length && (
            <FormHelperText>
              Type a skill and press Enter to add it.
            </FormHelperText>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ pr: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          disabled={!mySkill || !theirSkill}
          onClick={handleSubmit}
        >
          Send Request
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SwapRequestDialog;
