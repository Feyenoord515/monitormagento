import React from 'react';
import { Button } from '@mui/material';
import { useAuth } from '../AuthContext';

const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <Button onClick={logout} variant="contained" color="secondary">
      Cerrar Sesión
    </Button>
  );
};

export default LogoutButton;
