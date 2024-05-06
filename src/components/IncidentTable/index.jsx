import React, { useEffect, useState } from "react";
import {
  Snackbar,
  Dialog,
  Typography,
  Grid,
  Menu,
  MenuItem,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Icon } from "@iconify/react";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import "./style.css";
import IncidentForm from "../IncidentForm";
import { categories } from "../../helpers/utils";
import SimpleCard from "../SimpleCard";
import Filters from "./Filters";
import ChangeStatusDialog from "../IncidentChangeState";
import IncidenteService from "../../services/incident.service";
import AddObservationDialog from "../incidentObservation";
import VerIncidente from "../IncidentResume";

const IncidentTable = ({ incidentes, setIncidentes }) => {
  const [incidentesFiltered, setIncidentesFiltered] = useState(incidentes);
  const [selectedIncidente, setSelectedIncidente] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [openObservationModal, setOpenObservationModal] = useState(false);
  const [openVerIncidente, setOpenVerIncidente] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [openMenus, setOpenMenus] = useState({});

  const handleClick = (event, incidente) => {
    setAnchorEl(event.currentTarget);
    setOpenMenus({
      ...openMenus,
      [incidente._id]: true,
    });
  };

  const handleClose = (incidente) => {
    setAnchorEl(null);
    setOpenMenus({
      ...openMenus,
      [incidente._id]: false,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleEditIncidente = (incidente) => {
    setSelectedIncidente(incidente);
    setOpenDialog(true);
  };

  const handleVerIncidente = (incidente) => {
    console.log(incidente);
    setSelectedIncidente(incidente);
    setOpenVerIncidente(true);
  };

  const handleCloseDialog = () => {
    setSelectedIncidente(null);
    setOpenDialog(false);
  };

  const handleOpenStatusDialog = (incidente) => {
    setSelectedIncidente(incidente);
    setOpenStatusDialog(true);
  };

  const handleCloseStatusDialog = () => {
    setOpenStatusDialog(false);
    setSelectedIncidente(null);
  };

  const handleOpenObservationModal = (incidente) => {
    setSelectedIncidente(incidente);
    setOpenObservationModal(true);
  };

  const handleCloseObservationModal = () => {
    setOpenObservationModal(false);
  };

  const handleAddObservation = async (observacion) => {
    try {
      if (!selectedIncidente) return;

      const username = localStorage.getItem("fullName");
      await IncidenteService.addObservacionToIncidente(selectedIncidente._id, {
        observacion,
        username,
      });
      setSnackbarSeverity("success");
      setSnackbarMessage("Observación agregada correctamente");
      setSnackbarOpen(true);
      const updatedIncidentes = await IncidenteService.getAllIncidentes();
      setIncidentes(updatedIncidentes);
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Error al agregar la observación al incidente");
      setSnackbarOpen(true);
    }
  };

  const handleConfirmStatusChange = async (newState, observacion) => {
    try {
      if (!selectedIncidente) return;

      const username = localStorage.getItem("fullName");
      await IncidenteService.updateIncidenteEstadoObservacion(
        selectedIncidente._id,
        newState,
        { observacion, username }
      );
      setSnackbarSeverity("success");
      setSnackbarMessage("Estado del incidente actualizado correctamente");
      setSnackbarOpen(true);
      const updatedIncidentes = await IncidenteService.getAllIncidentes();
      setIncidentes(updatedIncidentes);
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Error al actualizar el estado del incidente");
      setSnackbarOpen(true);
    }
  };

  function formatDate(dateString) {
    const fecha = new Date(dateString);
    const dia = fecha.getDate().toString().padStart(2, "0");
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }

  useEffect(() => {
    setIncidentesFiltered(incidentes);
  }, [incidentes]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentIncidentes = incidentesFiltered.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      <Filters
        arrayOriginal={incidentes}
        setData={(value) => setIncidentesFiltered(value)}
      />
      <Table>
        <Thead>
          <Tr>
            <Th>Código</Th>
            <Th>Fecha</Th>
            <Th>Tipo de Incidente</Th>
            <Th>Título</Th>
            <Th>Reclamante</Th>
            <Th>Dirección</Th>
            <Th>Teléfono</Th>
            <Th>Estado</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {currentIncidentes.map((incidente) => (
            <Tr key={incidente._id}>
              <Td>{incidente.codigo}</Td>
              <Td>{formatDate(incidente.date)}</Td>
              <Td>{incidente.tipoIncidente}</Td>
              <Td>{incidente.titulo}</Td>
              <Td>{incidente.reclamante.nombreCompleto}</Td>
              <Td>{incidente.reclamante.direccion.calle}</Td>
              <Td>{incidente.reclamante.telefono}</Td>
              <Td>{incidente.estado}</Td>
              <Td>
                <Grid style={{ display: "flex", justifyContent: "center" }}>
                  <Icon
                    icon="charm:menu-kebab"
                    aria-expanded={openMenus[incidente._id]}
                    onClick={(event) => handleClick(event, incidente)}
                    style={{ cursor: "pointer" }}
                  />
                </Grid>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={openMenus[incidente._id]}
                  onClose={() => handleClose(incidente)}
                  PaperProps={{
                    style: {
                      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                    },
                  }}
                >
                  <MenuItem onClick={() => handleVerIncidente(incidente)}>
                    Ver reclamo
                  </MenuItem>
                  <MenuItem onClick={() => handleEditIncidente(incidente)}>
                    Editar reclamo
                  </MenuItem>
                  <MenuItem onClick={() => handleOpenStatusDialog(incidente)}>
                    Cambiar estado
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleOpenObservationModal(incidente)}
                  >
                    Agregar observación
                  </MenuItem>
                </Menu>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Grid spacing={2} style={{ justifyContent: "center", marginTop: "20px" }}>
        <Pagination
          count={Math.ceil(incidentesFiltered.length / itemsPerPage)}
          page={currentPage}
          onChange={handleChangePage}
          sx={{ display: "flex", justifyContent: "center" }}
        />
      </Grid>
      <ChangeStatusDialog
        open={openStatusDialog}
        onClose={handleCloseStatusDialog}
        onConfirm={handleConfirmStatusChange}
        incidente={selectedIncidente}
      />
      <AddObservationDialog
        open={openObservationModal}
        onClose={handleCloseObservationModal}
        onConfirm={handleAddObservation}
        incidente={selectedIncidente}
      />
      <VerIncidente
        incidente={selectedIncidente}
        open={openVerIncidente}
        onClose={() => setOpenVerIncidente(false)}
      />
      <Dialog
        onClose={handleCloseDialog}
        open={openDialog}
        sx={{
          ".MuiPaper-root": {
            padding: "40px",
            maxHeight: "80vh",
          },
        }}
      >
        <Typography variant="h4" mb={"20px"}>
          Editar reclamo
        </Typography>
        <Grid container spacing={2} mb={"20px"}>
          {categories.map((element, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              {" "}
              {/* Adjust the number of columns for different screen sizes */}
              <SimpleCard
                isEdit={true}
                handleClick={() => {}}
                data={element}
                selectedCategory={selectedIncidente?.tipoIncidente}
              />
            </Grid>
          ))}
        </Grid>
        <IncidentForm
          data={selectedIncidente}
          type={selectedIncidente?.tipoIncidente}
          columns={12}
          onCloseForm={handleCloseDialog}
          updateTableData={(response) => {
            if (response) {
              setIncidentes([...incidentes, response]);
            }
            handleCloseDialog();
          }}
        />
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default IncidentTable;
