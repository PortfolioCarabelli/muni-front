import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";

const ChangeStatusDialog = ({ open, onClose, onConfirm, incidente }) => {
  const [estado, setEstado] = useState(incidente?.estado || ""); // Estado inicial desde incidente o cadena vacía
  const [observacion, setObservacion] = useState("");

  // Asegurarse de actualizar el estado cuando cambia el incidente seleccionado
  useEffect(() => {
    setEstado(incidente?.estado || ""); // Actualizar estado cuando cambia el incidente
  }, [incidente]);

  const handleConfirmChange = () => {
    const newState = estado;
    const newObservacion = observacion;
    if (!newState || !newObservacion) return;
    onConfirm(newState, newObservacion);
    setObservacion("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          width: "400px",
          height: "auto",
        },
      }}
    >
      <DialogTitle>Cambiar Estado</DialogTitle>
      <DialogContent style={{ padding: "24px" }}>
        <TextField
          select
          fullWidth
          label="Estado"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
        >
          <MenuItem value="Pendiente">Pendiente</MenuItem>
          <MenuItem value="En proceso">En proceso</MenuItem>
          <MenuItem value="Cerrado">Cerrado</MenuItem>
          <MenuItem value="Desestimado">Desestimado</MenuItem>
        </TextField>
        <TextField
          fullWidth
          multiline
          rows={5}
          label="Observación"
          value={observacion}
          onChange={(e) => setObservacion(e.target.value)}
          style={{ padding: "10px 0px" }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleConfirmChange}
          variant="contained"
          color="primary"
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeStatusDialog;