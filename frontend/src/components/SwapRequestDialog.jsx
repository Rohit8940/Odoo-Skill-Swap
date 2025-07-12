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
  const { user, setUser } = useAuth(); // logged‑in user (has skillsOffered)
  const [mySkill, setMySkill] = useState('');
  const [theirSkill, setTheirSkill] = useState('');
  const [message, setMessage] = useState('');

  /* local option arrays so we can push new skills */
  const [myOptions, setMyOptions] = useState([]);
  const [theirOptions, setTheirOptions] = useState([]);

  /* Reset dialog on open */
  useEffect(() => {
    if (open) {
      setMyOptions(user?.skillsOffered || []);
      setTheirOptions(targetUser?.skillsWanted || []);
      setMySkill('');
      setTheirSkill('');
      setMessage('');
    }
  }, [open, user, targetUser]);

  /* Handlers to add newly typed skills into option arrays */
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
    // 1. If mySkill is new, add it to profile first
    if (!user.skillsOffered.includes(mySkill)) {
      await api.patch('/users/me', {
        $addToSet: { skillsOffered: mySkill },
      });
      // also update local context so dropdown stays in sync
      setUser((prev) => ({
        ...prev,
        skillsOffered: [...(prev.skillsOffered || []), mySkill],
      }));
    }

    // 2. Now create the swap
    await api.post('/swaps', {
      toUser: targetUser._id,
      offeredSkill: mySkill,
      requestedSkill: theirSkill,
      message,
    });

    // optional toast
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
          {/* Your offered skill */}
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

          {/* Their wanted skill */}
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

          {/* Optional message */}
          <TextField
            label="Message (optional)"
            multiline
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
          />

          {/* Small helper if arrays are empty */}
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
