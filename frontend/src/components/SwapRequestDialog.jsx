// src/components/SwapRequestDialog.jsx
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Stack,
} from '@mui/material';
import { useState } from 'react';
import { useAuth } from '../context/AuthProvider.jsx';
import api from '../services/api';

const SwapRequestDialog = ({ open, onClose, targetUser }) => {
  const { user } = useAuth();           // logged‑in user (you)
  const [mySkill, setMySkill] = useState('');
  const [theirSkill, setTheirSkill] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    try {
      await api.post('/swaps', {
        toUser: targetUser.id,
        offeredSkill: mySkill,
        requestedSkill: theirSkill,
        message,
      });
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Request a Skill Swap</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3} mt={1}>
          <FormControl fullWidth>
            <InputLabel>Your offered skill</InputLabel>
            <Select
              value={mySkill}
              label="Your offered skill"
              onChange={(e) => setMySkill(e.target.value)}
            >
              {user?.skillsOffered?.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Skill you want</InputLabel>
            <Select
              value={theirSkill}
              label="Skill you want"
              onChange={(e) => setTheirSkill(e.target.value)}
            >
              {targetUser.skillsWanted.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Message"
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!mySkill || !theirSkill}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SwapRequestDialog;
