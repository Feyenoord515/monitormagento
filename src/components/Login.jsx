import React, { useState } from 'react';
import  {useAuth}  from '../AuthContext';
import { Box, Button, TextField } from '@mui/material';

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!login(username, password)) {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            label="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            autoComplete="username"
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            fullWidth
          />
        </Box>
        {error && <Box color="red" mb={2}>{error}</Box>}
        <Button type="submit" variant="contained" color="primary">
          Ingresar
        </Button>
      </form>
    </Box>
  );
};

export default Login;
