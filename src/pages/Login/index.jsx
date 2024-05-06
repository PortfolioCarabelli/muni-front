import React, { useState } from 'react';
import { Grid, Typography, TextField, IconButton, InputAdornment, Button, Link, Snackbar } from '@mui/material';
import { Icon } from '@iconify/react';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth.service'; // Importar el servicio de autenticación

export default function Login() {
  const { setAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] =useState('')
  
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await AuthService.login(email, password);
      console.log('response', response);
      if (response.token) {
        const accessToken = response?.token;
        const roles = [response?.roleCode];

        setAuth({ email, roles,isAuthenticated: true, accessToken});

        setLoading(false);
        navigate('/');
      } else {
        setMessage('Inicio de sesión fallido');
        setOpen(true)
        setLoading(false);
      }
    } catch (error) {
      setMessage("Error al iniciar sesión")
      setOpen(true)
      console.error('Error al iniciar sesión:', error);
      setLoading(false);
    }
  };
  
  const handleForgotPasswordClick = () => {
    navigate('/forgot-password');
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{height:"90vh"}}>
      <Grid item xs={12} sm={8} md={6} lg={4} xl={3}>
        <Grid container justifyContent="center" alignItems="center" style={{backgroundColor: 'white', borderRadius: '15px', padding: '30px', boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)' }}>
          <form onSubmit={handleSubmit} style={{width: '100%'}}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h5" align="center" gutterBottom>
                  Iniciar Sesión
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Correo Electrónico"
                  variant="standard"
                  fullWidth
                  value={email}
                  onChange={handleEmailChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Contraseña"
                  variant="standard"
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                          {showPassword ? <Icon icon="mdi:eye-off-outline" /> : <Icon icon="mdi:eye-outline" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                  <Link href="#" variant="body2" onClick={handleForgotPasswordClick}>
                    Olvidé mi contraseña
                  </Link>
              </Grid>

              <Grid item xs={12}>
                <Button variant="outlined" color="primary" fullWidth type="submit" disabled={loading}>
                  {loading ? 'Cargando...' : 'Ingresar'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        onClose={handleClose}
        message={message}
        action={<Icon icon="mdi:close" onClick={handleClose} style={{cursor: 'pointer'}}/>
      }
      />
    </Grid>
  );
}
