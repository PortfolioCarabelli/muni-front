import React, { useEffect, useState } from "react";
import { Dialog, Button, Grid, Typography } from "@mui/material";
import IncidentForm from "../../components/IncidentForm";
import IncidentTable from "../../components/IncidentTable";
import { categories } from "../../helpers/utils";
import SimpleCard from "../../components/SimpleCard";
import IncidenteService from "../../services/incident.service";

export default function IncidenceList() {
  const [open, setOpen] = useState(false);
  const [incidentes, setIncidentes] = useState([]);
  const [IncidentTableKey, setIncidentTableKeyKey] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("Otros");

  const handleClick = (category) => {
    setSelectedCategory(category);
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleListItemClick = (value) => {
    setOpen(value);
  };

  const handleCloseForm = () => {
    setOpen(false);
  };

  const updateIncidentTable = () => {
    // Incrementar la clave de la tabla de usuarios para forzar una actualización
    setIncidentTableKeyKey((prevKey) => prevKey + 1);
  };

  const fetchIncidentes = async () => {
    try {
      const incidenteList = await IncidenteService.getAllIncidentes();
      
      // Ordenar los incidentes por proximidad a la fecha actual
      incidenteList.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        
        // Calcula la diferencia de tiempo entre la fecha actual y las fechas de los incidentes
        const diffA = Math.abs(new Date() - dateA);
        const diffB = Math.abs(new Date() - dateB);
        
        // Ordena de forma ascendente por proximidad a la fecha actual
        return diffA - diffB;
      });
      
      setIncidentes(incidenteList);
    } catch (error) {
      console.error("Error al obtener incidentes:", error);
    }
  };
  
  

  useEffect(() => {
    fetchIncidentes();
  }, []);

  return (
    <Grid
      container
      justifyContent={"center"}
      alignItems={"flex-start"}
      sx={{ height: "fit-content", padding: "20px", borderRadius: "10px" }}
    >
      <Grid
        item
        xs={12}
        sx={{
          color: "#007aff",
          textAlign: "center",
          fontWeight: "600",
          width: "100%",
          borderRadius: "10px",
          marginBottom: "20px",
          height: "auto",
        }}
      >
        <Typography fontWeight={"600"} variant="h5" color="#153d6a">
          Listado de Reclamos
        </Typography>
      </Grid>
      <Grid
        item
        xs={10}
        justifyContent="end"
        sx={{ display: "flex", height: "auto" }}
      >
        <Button
          variant="contained"
          sx={{ textTransform: "none", backgroundColor: "#153d6a" }}
          onClick={handleOpenDialog}
        >
          Nuevo Reclamo
        </Button>
      </Grid>
      <Grid item xs={10} marginTop={2}>
        <IncidentTable
          key={IncidentTableKey}
          incidentes={incidentes}
          setIncidentes={setIncidentes}
        />
        <Dialog
          open={open}
          onClose={handleCloseForm}
          sx={{
            ".MuiPaper-root": {
              padding: "40px",
              height: "80vh",
            },
          }}
        >
          <Typography variant="h4" mb={"20px"}>
            Nuevo reclamo
          </Typography>
          <Grid container spacing={2} mb={"20px"}>
            {categories.map((element, i) => (
              <Grid item xs={6} sm={6} md={4} lg={3} key={i}>
                {" "}
                {/* Adjust the number of columns for different screen sizes */}
                <SimpleCard
                  data={element}
                  handleClick={handleClick}
                  selectedCategory={selectedCategory}
                />
              </Grid>
            ))}
          </Grid>
          <IncidentForm
            onCloseForm={() => {
              handleListItemClick(false);
              updateIncidentTable();
            }}
            type={selectedCategory}
          />
        </Dialog>
      </Grid>
    </Grid>
  );
}
