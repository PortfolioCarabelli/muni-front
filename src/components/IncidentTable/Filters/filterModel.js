import React, { useState, useEffect } from "react";
import {
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  IconButton,
  Select,
  MenuItem,
  Slider,
  Typography,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  FormGroup,
  Checkbox,
  Button,
  Menu,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import OpportunityService from "../../../services/oportunityService";
import { capitalizeWords } from "../../../helpers";
import { useStyles } from "./styles";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

const Filters = ({ setData, originalArr }) => {
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState("");
  const [filterStates, setFilterStates] = useState({
    estado: { value: 0, applied: false },
    operacion: { value: 0, applied: false },
    tipoInmueble: { value: 0, applied: false },
    habitaciones: { value: 0, applied: false },
    cantBanos: { value: "Todos", applied: false },
    precioRange: [
      Math.min(...originalArr.map((item) => item.precio)),
      Math.max(...originalArr.map((item) => item.precio)),
    ],
    amenities: {
      ascensor: false,
      cochera: false,
      piscina: false,
      salon: false,
      terraza: false,
      trastero: false,
    },
  });
  const [estadoLabels, setEstadoLabels] = useState([]);
  const [operacionesLabels, setOperacionesLabels] = useState([]);
  const [tipoInmuebleLabels, setTipoInmuebleLabels] = useState([]);
  const [habitacionOptions, setHabitacionOptions] = useState([
    "1",
    "2",
    "3",
    "4 o más",
  ]);
  const [bathroomsOptions, setBathroomsOptions] = useState([
    "Todos",
    "1",
    "2",
    "3 o más baños",
  ]);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMoreFilters = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMoreFilters = () => {
    setAnchorEl(null);
  };

  const amenitiesOptions = [
    "ascensor",
    "cochera",
    "piscina",
    "salon",
    "terraza",
    "trastero",
  ];

  useEffect(() => {
    async function fetchData() {
      const arrEstados = await OpportunityService.getEstado();
      const arrTipoOperacion = await OpportunityService.getTipoOperacion();
      const arrTipoInmueble = await OpportunityService.getTipoInmueble();

      setEstadoLabels(arrEstados);
      setOperacionesLabels(arrTipoOperacion);
      setTipoInmuebleLabels(arrTipoInmueble);
    }
    fetchData();
  }, []);

  const applyFilters = () => {
    const filteredData = originalArr.filter((item) => {
      const titleMatch = item.titulo
        .toLowerCase()
        .includes(searchValue.toLowerCase());
      const estadoMatch =
        !filterStates.estado.applied ||
        item.estado_id === filterStates.estado.value;

      const operacionMatch =
        !filterStates.operacion.applied ||
        item.tipo_operacion_id === filterStates.operacion.value;

      const tipoInmuebleMatch =
        !filterStates.tipoInmueble.applied ||
        item.tipo_inmueble_id === filterStates.tipoInmueble.value;

      const habitacionesMatch =
        !filterStates.habitaciones.applied ||
        item.habitaciones == filterStates.habitaciones.value ||
        (filterStates.habitaciones.value == "4 o más" &&
          item.habitaciones >= 4);

      const minPrice = filterStates.precioRange[0];
      const maxPrice =
        filterStates.precioRange[1] +
        (filterStates.operacion.applied ? filterStates.operacion.value : 0);

      const bathroomsMatch =
        !filterStates.cantBanos.applied ||
        (filterStates.cantBanos.value === "3 o más baños"
          ? item.cant_banos >= 3
          : item.cant_banos.toString() === filterStates.cantBanos.value);

      const amenitiesMatch = amenitiesOptions.every(
        (option) =>
          filterStates.amenities[option] === false ||
          item[option] ===
            (filterStates.amenities[option] === true ? "si" : "no")
      );

      const priceMatch = item.precio >= minPrice && item.precio <= maxPrice;

      return (
        titleMatch &&
        estadoMatch &&
        operacionMatch &&
        tipoInmuebleMatch &&
        habitacionesMatch &&
        priceMatch &&
        bathroomsMatch &&
        amenitiesMatch
      );
    });

    setData(filteredData);
  };

  const handleFilterChange = (filterName, value) => {
    if (filterName === "amenities") {
      setFilterStates((prevFilters) => ({
        ...prevFilters,
        [filterName]: {
          ...prevFilters[filterName],
          [value]: !prevFilters[filterName][value],
        },
      }));
    } else {
      setFilterStates((prevFilters) => ({
        ...prevFilters,
        [filterName]: {
          value: value,
          applied: value !== "Todos" && value !== 0,
        },
      }));
    }
  };

  useEffect(() => {
    applyFilters();
  }, [filterStates, searchValue]);

  return (
    <Grid container style={{ justifyContent: "space-between", marginTop: 20 }}>
      <Grid item xs={12} sm={3} className={classes.itemsContainer}>
        <FormControl className={classes.formControl} variant="outlined">
          <OutlinedInput
            id="search"
            type="text"
            className={classes.inputStyles}
            placeholder="Ingrese un titulo"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton edge="end">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            }
            // labelWidth={70}
          />
        </FormControl>
      </Grid>
      <Grid item xs={6} sm={2} className={classes.itemsContainer}>
        <FormControl className={classes.formControl} variant="outlined">
          <InputLabel id="tipo-inmueble-label">Tipo de Inmueble</InputLabel>
          <Select
            labelId="tipo-inmueble-label"
            id="tipo-inmueble-select"
            className={classes.inputStyles}
            value={filterStates.tipoInmueble.value}
            onChange={(e) => handleFilterChange("tipoInmueble", e.target.value)}
            label="Tipo de Inmueble"
          >
            <MenuItem value={0}>
              <em>Todos</em>
            </MenuItem>
            {tipoInmuebleLabels.map((tipo) => (
              <MenuItem key={tipo.id} value={tipo.id}>
                {capitalizeWords(tipo.descripcion)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6} sm={2} className={classes.itemsContainer}>
        <FormControl className={classes.formControl} variant="outlined">
          <InputLabel id="tipo-operacion-label">Operación</InputLabel>
          <Select
            labelId="tipo-operacion-label"
            id="tipo-operacion-select"
            className={classes.inputStyles}
            value={filterStates.operacion.value}
            onChange={(e) => handleFilterChange("operacion", e.target.value)}
            label="Operación"
          >
            <MenuItem value={0}>
              <em>Todos</em>
            </MenuItem>
            {operacionesLabels.map((operacion) => (
              <MenuItem key={operacion.id} value={operacion.id}>
                {operacion.descripcion}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6} sm={2} className={classes.itemsContainer}>
        <FormControl className={classes.formControl} variant="outlined">
          <InputLabel id="estado-label">Estado</InputLabel>
          <Select
            labelId="estado-label"
            id="estado-select"
            className={classes.inputStyles}
            value={filterStates.estado.value}
            onChange={(e) => handleFilterChange("estado", e.target.value)}
            label="Tipo de Vivienda"
          >
            <MenuItem value={0}>
              <em>Todos</em>
            </MenuItem>
            {estadoLabels.map((vivienda) => (
              <MenuItem key={vivienda.id} value={vivienda.id}>
                {capitalizeWords(vivienda.descripcion)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6} sm={1} className={classes.itemsContainer}>
        <FormControl className={classes.formControl} variant="outlined">
          <InputLabel id="habitaciones-label">Habitaciones</InputLabel>
          <Select
            labelId="habitaciones-label"
            id="habitaciones-select"
            className={classes.inputStyles}
            value={filterStates.habitaciones.value}
            onChange={(e) => handleFilterChange("habitaciones", e.target.value)}
            label="Habitaciones"
            inputProps={{
              fieldset: "select-multiple-native",
            }}
          >
            <MenuItem value={0}>
              <em>Todos</em>
            </MenuItem>
            {habitacionOptions.map((habitacion) => (
              <MenuItem key={habitacion} value={habitacion}>
                {habitacion}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={2} className={classes.buttonContainer}>
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleOpenMoreFilters}
          className={classes.buttonMoreFilters}
        >
          <FilterAltIcon /> Más filtros
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          className={classes.menuContainer}
          open={Boolean(anchorEl)}
          onClose={handleCloseMoreFilters}
        >
          <MenuItem>
            <Grid item xs={12}>
              <FormControl className={classes.formControl} fullWidth>
                <Typography id="precio-range-slider" gutterBottom>
                  Precio
                </Typography>
                <Slider
                  className={classes.sliderPrice}
                  value={filterStates.precioRange}
                  onChange={(e, newValue) =>
                    setFilterStates((prevFilters) => ({
                      ...prevFilters,
                      precioRange: [
                        Math.min(newValue[0], prevFilters.precioRange[1]),
                        newValue[1],
                      ],
                    }))
                  }
                  valueLabelDisplay="auto"
                  aria-labelledby="precio-range-slider"
                  // min={Math.min(...originalArr.map((item) => item.precio))}
                  min={0}
                  // max={Math.max(...originalArr.map((item) => item.precio))}
                  max={2000000}
                />
                <Grid
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography variant="body2">Desde: {0} €</Typography>
                  <Typography variant="body2">Hasta: 2.000.000 €</Typography>
                </Grid>
              </FormControl>
            </Grid>
          </MenuItem>
          <MenuItem>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend" style={{ color: "#000" }}>
                  Baños
                </FormLabel>
                <RadioGroup
                  aria-label="bathrooms"
                  name="bathrooms"
                  value={filterStates.cantBanos.value}
                  onChange={(e) =>
                    handleFilterChange("cantBanos", e.target.value)
                  }
                >
                  {bathroomsOptions.map((option) => (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={<Radio />}
                      label={option}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Grid>
          </MenuItem>
          <MenuItem>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend" style={{ color: "#000" }}>
                  Características
                </FormLabel>
                <FormGroup>
                  {amenitiesOptions.map((option) => (
                    <FormControlLabel
                      key={option}
                      control={
                        <Checkbox
                          checked={filterStates.amenities[option]}
                          onChange={() =>
                            handleFilterChange("amenities", option)
                          }
                          name={option}
                        />
                      }
                      label={option == "salon" ? "salón" : option}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </Grid>
          </MenuItem>
        </Menu>
      </Grid>
    </Grid>
  );
};

export default Filters;
