import React, { useState } from 'react';
import { Grid, Typography, TextField, Button, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth.service';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Enviar solicitud al backend
      await AuthService.sendRecoverEmail(email);
      
      // Actualizar el estado para mostrar que la solicitud se ha enviado correctamente
      setResetSent(true);
      setError(null); // Limpiar cualquier error anterior
    } catch (error) {
      // Manejar errores de la solicitud
      console.error('Error al enviar solicitud de recuperación de contraseña:', error);
      setError("No se pudo enviar el correo electrónico de restablecimiento. Por favor, inténtalo de nuevo más tarde.");
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
        <Grid container justifyContent="center" alignItems="center" style={{backgroundColor: 'white', borderRadius: '15px', padding: '30px', boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)' }}>
          <form onSubmit={handleSubmit} style={{width: '100%'}}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h5" align="center" gutterBottom>
                  ¿Olvidaste tu contraseña?
                </Typography>
              </Grid>
              {!resetSent ? (
                <>
                  <Grid item xs={12}>
                    <TextField
                      label="Correo Electrónico"
                      variant="standard"
                      fullWidth
                      value={email}
                      onChange={handleEmailChange}
                      required // Hacer el campo requerido
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="outlined" color="primary" fullWidth type="submit" disabled={loading || !email.trim()}>
                      {loading ? 'Enviando...' : 'Enviar correo de restablecimiento'}
                    </Button>
                  </Grid>
                </>
              ) : (
                <Grid item xs={12}>
                  <Typography variant="body1" align="center">
                    Se ha enviado un correo electrónico de restablecimiento a {email}.
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
