import React, { useState } from 'react';
import { Grid, Typography, TextField, Button, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth.service';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = new URLSearchParams(window.location.search).get('token');

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (password !== confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      // Enviar solicitud al backend
      await AuthService.resetPassword(token, password);

      // Actualizar el estado para mostrar que la contraseña se ha restablecido correctamente
      setResetSuccess(true);
      setError(null); // Limpiar cualquier error anterior
    } catch (error) {
      // Manejar errores de la solicitud
      console.error('Error al restablecer la contraseña:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVolverAIniciarSessionClick = () => {
    navigate('/login');
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ height: '90vh' }}>
      <Grid item xs={12} sm={8} md={6} lg={4} xl={3}>
        <Grid container justifyContent="center" alignItems="center" style={{ backgroundColor: 'white', borderRadius: '15px', padding: '30px', boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)' }}>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h5" align="center" gutterBottom>
                  Restablecer Contraseña
                </Typography>
              </Grid>
              {!resetSuccess ? (
                <>
                  <Grid item xs={12}>
                    <TextField
                      label="Nueva Contraseña"
                      variant="standard"
                      fullWidth
                      type="password"
                      value={password}
                      onChange={handlePasswordChange}
                      required // Hacer el campo requerido
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Confirmar Contraseña"
                      variant="standard"
                      fullWidth
                      type="password"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      required // Hacer el campo requerido
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="outlined" color="primary" fullWidth type="submit" disabled={loading || !password.trim() || !confirmPassword.trim()}>
                      {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
                    </Button>
                  </Grid>
                </>
              ) : (
                <Grid item xs={12}>
                  <Typography variant="body1" align="center">
                    ¡La contraseña se ha restablecido con éxito!
                  </Typography>
                </Grid>
              )}
              {error && (
                <Grid item xs={12}>
                  <Typography variant="body1" align="center" color="error">
                    {error}
                  </Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <Link href="#" variant="body2" onClick={handleVolverAIniciarSessionClick}>
                  Volver al inicio de sesión
                </Link>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Grid>
  );
}
