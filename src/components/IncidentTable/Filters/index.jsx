import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

const tiposReclamoOptions = ["", "Alumbrado", "Agua", "Calle", "Otros"];
const estadosOptions = ["", "Pendiente", "En proceso", "Cerrado", "Desestimado"];

const Filters = ({ arrayOriginal, setData }) => {
  const [searchCode, setSearchCode] = useState("");
  const [titulo, setTitulo] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [estado, setEstado] = useState("");
  const [tipoReclamo, setTipoReclamo] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "searchCode":
        setSearchCode(value);
        break;
      case "titulo":
        setTitulo(value);
        break;
      case "nombreCompleto":
        setNombreCompleto(value);
        break;
      case "estado":
        setEstado(value);
        break;
      case "tipoReclamo":
        setTipoReclamo(value);
        break;
      default:
        break;
    }
  };

  const applyFilters = () => {
    const filteredData = arrayOriginal.filter((item) => {
      const codeMatch = item.codigo.toLowerCase().includes(searchCode.toLowerCase());
      const tituloMatch = item.titulo.toLowerCase().includes(titulo.toLowerCase());
      const nombreMatch = item.reclamante.nombreCompleto.toLowerCase().includes(nombreCompleto.toLowerCase());
      const estadoMatch = estado === "" || item.estado.toLowerCase() === estado.toLowerCase();
      const tipoReclamoMatch = tipoReclamo === "" || item.tipoIncidente.toLowerCase() === tipoReclamo.toLowerCase();
      return codeMatch && tituloMatch && nombreMatch && estadoMatch && tipoReclamoMatch;
    });
    setData(filteredData);
  };

  const handleClearFilters = () => {
    setSearchCode("");
    setTitulo("");
    setNombreCompleto("");
    setEstado("");
    setTipoReclamo("");
  };

  useEffect(() => {
    applyFilters();
  }, [searchCode, titulo, nombreCompleto, estado, tipoReclamo]);

  return (
    <Grid container spacing={2} style={{ marginBottom: "20px" }}>
      <Grid item xs={6} sm={2}>
        <TextField
          label="Codigo"
          variant="outlined"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
        />
      </Grid>
      <Grid item xs={6} sm={2}>
        <TextField
          label="Título"
          variant="outlined"
          name="titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
      </Grid>
      <Grid item xs={6} sm={2}>
        <TextField
          label="Reclamante"
          variant="outlined"
          name="nombreCompleto"
          value={nombreCompleto}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={6} sm={2}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel id="tipoReclamoLabel">Tipo de Reclamo</InputLabel>
          <Select
            labelId="tipoReclamoLabel"
            id="tipoReclamo"
            name="tipoReclamo"
            value={tipoReclamo}
            onChange={handleChange}
            label="Tipo de Reclamo"
          >
            {tiposReclamoOptions.map((tipo) => (
              <MenuItem key={tipo} value={tipo}>
                {tipo || "Todos"}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6} sm={2}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel id="estadoLabel">Estado</InputLabel>
          <Select
            labelId="estadoLabel"
            id="estado"
            name="estado"
            value={estado}
            onChange={handleChange}
            label="Estado"
          >
            {estadosOptions.map((estado) => (
              <MenuItem key={estado} value={estado}>
                {estado || "Todos"}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      {/* <Grid item xs={6} sm={3}>
        <TextField
          label="Fecha"
          variant="outlined"
          name="date"
          value={filters.date.value}
          onChange={handleChange}
        />
      </Grid> */}
      <Grid item xs={6} sm={2}>
        <Button variant="outlined" sx={{color: '#153d6a', borderColor: '#153d6a'}} onClick={handleClearFilters}>
          Limpiar
        </Button>
      </Grid>
    </Grid>
  );
};

export default Filters;
