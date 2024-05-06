import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";

const AddObservationDialog = ({ open, onClose, onConfirm, incidente }) => {
  const [observacion, setObservacion] = useState("");

  const handleConfirm = () => {
    onConfirm(observacion);
    setObservacion(""); // Limpiar el campo de observación después de confirmar
    onClose(); // Cerrar el diálogo después de confirmar
  };

  const handleConfirmChange = () => {
    const newObservacion = observacion; // Usa la observación del diálogo
    if (!newObservacion) return; // Verifica si los datos necesarios están definidos
    onConfirm(newObservacion); // Llama a la función de confirmación con los datos
    setObservacion(""); // Limpiar el campo de observación después de confirmar
    onClose(); // Cerrar el diálogo después de confirmar
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          width: "400px",
          height: "auto",
          padding: "16px",
        },
      }}
    >
      <DialogTitle >
        Agregar Observacion
      </DialogTitle>
      <DialogContent style={{paddingTop: '20px'}}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Observación"
          value={observacion}
          onChange={(e) => setObservacion(e.target.value)}
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

export default AddObservationDialog;
