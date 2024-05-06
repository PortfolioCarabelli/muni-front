import React, { useState } from "react";
import { useFormik } from "formik";
import { validationSchema } from "./constants";
import { Grid, TextField, Snackbar, Typography, Button } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import IncidenteService from "../../services/incident.service";

const MySwal = withReactContent(Swal);

const IncidentForm = ({ onCloseForm, data = null, type, columns = 12 }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  console.log(type);

  const initialValues = {
    titulo: data?.titulo || "", // Valor del título, si está presente en los datos proporcionados
    tipoIncidente: data?.tipoIncidente || type || "", // Tipo de incidente proporcionado
    descripcion: data?.descripcion || "", // Descripción, si está presente en los datos proporcionados
    observacion: data?.observacion || "",
    reclamante: {
      nombreCompleto: data?.reclamante?.nombreCompleto || "",
      email: data?.reclamante?.email || "",
      telefono: data?.reclamante?.telefono || "",
      direccion: {
        calle: data?.reclamante?.direccion?.calle || "",
        calle1: data?.reclamante?.direccion?.calle1 || "",
        calle2: data?.reclamante?.direccion?.calle2 || "",
      },
    },
    observaciones: [],
  };

  const formik = useFormik({
    initialValues: data?._id ? data : initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => handleSubmit(values),
  });

  console.log("formik", formik);

  const handleSubmit = async (values) => {
    try {
      const username = localStorage.getItem("fullName");
      console.log(username);
      const formData = new FormData();
      formData.append("titulo", values.titulo);
      formData.append("tipoIncidente", type || "Otros");
      formData.append("descripcion", values.descripcion);
      formData.append("observacion", values.observacion);
      formData.append(
        "reclamante.nombreCompleto",
        values.reclamante.nombreCompleto
      );
      formData.append("reclamante.email", values.reclamante.email);
      formData.append("reclamante.telefono", values.reclamante.telefono);
      formData.append(
        "reclamante.direccion.calle",
        values.reclamante.direccion.calle
      );
      formData.append("username", username); 
      // Agregar los campos adicionales según sea necesario

      if (values.reclamante.direccion.calle1) {
        formData.append(
          "reclamante.direccion.calle1",
          values.reclamante.direccion.calle1
        );
      }

      if (values.reclamante.direccion.calle2) {
        formData.append(
          "reclamante.direccion.calle2",
          values.reclamante.direccion.calle2
        );
      }
      console.log(formData)
      if (data?._id) {
        // Si existe el ID del producto, es una actualización
        const response = await IncidenteService.updateIncidente(
          data._id,
          formData
        );
        MySwal.fire({
          title: <p>El incidente fue actualizado con éxito</p>,
          icon: "success",
          confirmButtonColor: "#ff9800",
        });
      } else {
        // Si no existe el ID del producto, es una creación
        const response = await IncidenteService.createIncidente(formData);
        setSnackbarMessage(`El incidente fue creado con éxito`);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      }
      onCloseForm();
    } catch (error) {
      console.error("Error al guardar el incidente:", error);
    }
    // Reiniciar el formulario
    formik.resetForm();
  };

  return (
    <Grid item container xs={columns}>
      <Typography variant="h5" mb={"10px"}>
        Categoria: {type}
      </Typography>
      <form style={{ marginTop: "10px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Titulo del Incidente"
              placeholder="Titulo del Incidente"
              variant="outlined"
              id="titulo"
              name="titulo"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={formik.values.titulo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.titulo && Boolean(formik.errors.titulo)}
              helperText={formik.touched.titulo && formik.errors.titulo}
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <TextField
              multiline
              rows={2}
              label="Descripcion del incidente"
              placeholder="Descripcion del incidente"
              variant="outlined"
              id="descripcion"
              name="descripcion"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={formik.values.descripcion}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.descripcion && Boolean(formik.errors.descripcion)
              }
              helperText={
                formik.touched.descripcion && formik.errors.descripcion
              }
            />
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom style={{ margin: "10px 0px" }}>
          Datos del reclamante
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <TextField
              label="Nombre Completo"
              placeholder="Juan Perez"
              variant="outlined"
              id="nombreCompleto"
              name="reclamante.nombreCompleto"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={formik.values.reclamante.nombreCompleto}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.nombreCompleto &&
                Boolean(formik.errors.nombreCompleto)
              }
              helperText={
                formik.touched.nombreCompleto && formik.errors.nombreCompleto
              }
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              label="Telefono"
              placeholder="3516125178"
              id="telefono"
              name="reclamante.telefono"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              fullWidth
              type="number"
              value={formik.values.reclamante.telefono}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.telefono && Boolean(formik.errors.telefono)}
              helperText={formik.touched.telefono && formik.errors.telefono}
            />
          </Grid>
          <Grid item xs={6} sm={5}>
            <TextField
              label="Email"
              placeholder="jperez@gmail.com"
              id="email"
              name="reclamante.email"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={formik.values.reclamante.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>
          <Grid item xs={12} sm={7}>
            <TextField
              label="Direccion"
              placeholder="Calle Algarrobo"
              variant="outlined"
              id="calle"
              name="reclamante.direccion.calle"
              fullWidth
              value={formik.values.reclamante.direccion.calle}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched["reclamante.direccion.calle"] &&
                Boolean(formik.errors["reclamante.direccion.calle"])
              }
              helperText={
                formik.touched["reclamante.direccion.calle"] &&
                formik.errors["reclamante.direccion.calle"]
              }
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom style={{ marginTop: "10px" }}>
              Entre las calles
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Calle"
              placeholder="Calle siempreviva 234"
              variant="outlined"
              id="calle1"
              name="reclamante.direccion.calle1"
              fullWidth
              value={formik.values.reclamante.direccion.calle1}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched["reclamante.direccion.calle1"] &&
                Boolean(formik.errors["reclamante.direccion.calle1"])
              }
              helperText={
                formik.touched["reclamante.direccion.calle1"] &&
                formik.errors["reclamante.direccion.calle1"]
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Calle"
              placeholder="Calle siempreviva 234"
              variant="outlined"
              id="calle2"
              name="reclamante.direccion.calle2"
              fullWidth
              value={formik.values.reclamante.direccion.calle2}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched["reclamante.direccion.calle2"] &&
                Boolean(formik.errors["reclamante.direccion.calle2"])
              }
              helperText={
                formik.touched["reclamante.direccion.calle2"] &&
                formik.errors["reclamante.direccion.calle2"]
              }
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              multiline
              rows={2}
              label="Observación"
              placeholder="Observación del incidente"
              variant="outlined"
              id="observacion"
              name="observacion"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={formik.values.observacion}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.observacion && Boolean(formik.errors.observacion)
              }
              helperText={
                formik.touched.observacion && formik.errors.observacion
              }
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            {formik.values.observaciones.length > 0 && (
              <TextField
              multiline
              rows={6}
              label="Historial de Observaciones"
              placeholder="Historial de observaciones anteriores"
              variant="outlined"
              id="historialObservaciones"
              name="historialObservaciones"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={formik.values.observaciones
                .map((observacion) => {
                  const fecha = new Date(observacion.fecha);
                  const formattedDate = `${fecha
                    .getDate()
                    .toString()
                    .padStart(2, "0")}-${(fecha.getMonth() + 1)
                    .toString()
                    .padStart(2, "0")}-${fecha.getFullYear()} ${fecha
                    .getHours()
                    .toString()
                    .padStart(2, "0")}:${fecha.getMinutes().toString().padStart(2, "0")}`;
                  return `${formattedDate} - ${observacion.username} - ${
                    observacion.observacion
                  }`;
                })
                .join("\n")}
              InputProps={{ readOnly: true, disabled: true }}
            />
            
            )}
          </Grid>
        </Grid>
      </form>
      <Grid
        item
        xs={12}
        container
        justifyContent="end"
        style={{ marginTop: "20px" }}
      >
        <Button
          variant="contained"
          sx={{ textTransform: "none", backgroundColor: '#153d6a'}}
          onClick={() => handleSubmit(formik.values)}
        >
          Guardar
        </Button>
      </Grid>
      {/* Snackbar para mostrar mensajes */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Grid>
  );
};

export default IncidentForm;
