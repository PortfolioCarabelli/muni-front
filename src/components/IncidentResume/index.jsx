import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  Paper,
  Box,
  Grid,
} from "@mui/material";

const VerIncidente = ({ open, onClose, incidente }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric"
    });
  };



  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          width: "600px",
          maxWidth: "95vw",
        },
      }}
    >
      <DialogTitle>Detalles del Incidente</DialogTitle>
      <DialogContent style={{ padding: "24px" }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Paper
              style={{
                padding: "12px",
                backgroundColor: "#f0f0f0",
                marginBottom: "16px",
              }}
            >
              <Typography
                variant="body1"
                component="span"
                sx={{ fontWeight: 400, fontSize: '14px' }}
              >
                Título del reclamo
              </Typography>
              <Typography variant="body1" style={{ fontWeight: 600, fontSize: '16px', color: '#404040'}}>{incidente?.titulo}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper
              style={{
                padding: "12px",
                backgroundColor: "#f0f0f0",
                marginBottom: "16px",
              }}
            >
              <Typography
                variant="body1"
                component="span"
                sx={{ fontWeight: 400, fontSize: '14px' }}
              >
                Código
              </Typography>{" "}
              <Typography variant="body1" style={{ fontWeight: 600, fontSize: '16px', color: '#404040'}}>{incidente?.codigo}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper
              style={{
                padding: "12px",
                backgroundColor: "#f0f0f0",
                marginBottom: "16px",
              }}
            >
              <Typography
                variant="body1"
                component="span"
                sx={{ fontWeight: 400, fontSize: '14px' }}
              >
                Tipo de incidente
              </Typography>{" "}
              <Typography variant="body1" style={{ fontWeight: 600, fontSize: '16px', color: '#404040'}}>{incidente?.tipoIncidente}</Typography>
            </Paper>
          </Grid>

          <Grid item xs={4}>
            <Paper
              style={{
                padding: "12px",
                backgroundColor: "#f0f0f0",
                marginBottom: "16px",
              }}
            >
              <Typography
                variant="body1"
                component="span"
                sx={{ fontWeight: 400, fontSize: '14px' }}
              >
                Estado
              </Typography>{" "}
              <Typography variant="body1" style={{ fontWeight: 600, fontSize: '16px', color: '#404040'}}>{incidente?.estado}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper
              style={{
                padding: "12px",
                backgroundColor: "#f0f0f0",
                marginBottom: "16px",
              }}
            >
              <Typography
                variant="body1"
                component="span"
                sx={{ fontWeight: 400, fontSize: '14px' }}
              >
                Fecha de Creación
              </Typography>{" "}
              <Typography variant="body1" style={{ fontWeight: 600, fontSize: '16px', color: '#404040'}}>
                {formatDate(incidente?.createdAt)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper
              style={{
                padding: "12px",
                backgroundColor: "#f0f0f0",
                marginBottom: "16px",
              }}
            >
              <Typography
                variant="body1"
                component="span"
                sx={{ fontWeight: 400, fontSize: '14px' }}
              >
                Descripcion del reclamo
              </Typography>{" "}
              <Typography variant="body1" style={{ fontWeight: 600, fontSize: '16px', color: '#404040'}}>{incidente?.descripcion}</Typography>
            </Paper>
          </Grid>

          <Divider style={{ margin: "16px 0" }} />

          <Grid item xs={12}>
            <Typography variant="h6">Reclamante</Typography>
          </Grid>
          <Grid item container spacing={2} xs={12}>
            <Grid item xs={8}>
              <Paper
                style={{
                  padding: "12px",
                  backgroundColor: "#f0f0f0",
                  marginBottom: "16px",
                }}
              >
                <Typography
                  variant="body1"
                  component="span"
                  sx={{ fontWeight: 400, fontSize: '14px' }}
                >
                  Nombre
                </Typography>{" "}
                <Typography variant="body1" style={{ fontWeight: 600, fontSize: '16px', color: '#404040'}}>
                  {incidente?.reclamante.nombreCompleto}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper
                style={{
                  padding: "12px",
                  backgroundColor: "#f0f0f0",
                  marginBottom: "16px",
                }}
              >
                <Typography
                  variant="body1"
                  component="span"
                  sx={{ fontWeight: 400, fontSize: '14px' }}
                >
                  Teléfono
                </Typography>{" "}
                <Typography variant="body1" style={{ fontWeight: 600, fontSize: '16px', color: '#404040'}}>
                  {incidente?.reclamante.telefono}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper
                style={{
                  padding: "12px",
                  backgroundColor: "#f0f0f0",
                  marginBottom: "16px",
                }}
              >
                <Typography
                  variant="body1"
                  component="span"
                  sx={{ fontWeight: 400, fontSize: '14px' }}
                >
                  Dirección
                </Typography>{" "}
                <Typography variant="body1" style={{ fontWeight: 600, fontSize: '16px', color: '#404040'}}>
                  {`${incidente?.reclamante.direccion.calle}, ${incidente?.reclamante.direccion.calle1}, ${incidente?.reclamante.direccion.calle2}`}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
          <Divider style={{ margin: "16px 0" }} />

          <Grid item container spacing={2} xs={12}>
            <Grid item xs={12}>
              <Typography variant="h6">Observaciones:</Typography>
            </Grid>
            {incidente?.observaciones.map((obs) => (
              <Grid item xs={12}>
                <Paper
                  key={obs._id}
                  style={{
                    padding: "12px",
                    backgroundColor: "#f0f0f0",
                    marginBottom: "16px",
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 400, fontSize: '14px' }}>
                   {formatDate(obs.fecha)} - {obs.username}
                  </Typography>
                  <Typography variant="body2" style={{ fontWeight: 600, fontSize: '16px', color: '#404040'}}>{obs.observacion}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default VerIncidente;
