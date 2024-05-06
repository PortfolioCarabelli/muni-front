import React, { useState, useEffect } from "react";
import {
  TableContainer,
  Paper,
  IconButton,
  Modal,
  Fade,
  Typography,
  Button,
  TextField,
  Grid,
  Box,
  InputAdornment,
  MenuItem
} from "@mui/material";
import { Icon } from "@iconify/react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import AuthService from "../../services/auth.service";
import RoleService from "../../services/role.service";

import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

import "./style.css";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    roleCode: "" // Agregamos el estado roleCode en formData
  });
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deleteUserName, setDeleteUserName] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const userData = await AuthService.getAllUsers();
      const rolesData = await RoleService.getAllRoles();

      // Mapear los datos de roles a un objeto de roles para facilitar la búsqueda por código de rol
      const rolesMap = rolesData.reduce((acc, role) => {
        acc[role.code] = role.name;
        return acc;
      }, {});

      // Asociar el nombre de rol correspondiente a cada usuario utilizando el código de rol
      const usersWithRoleNames = userData.map((user) => {
        return {
          ...user,
          roleName: rolesMap[user.roleCode] || "Sin rol",
        };
      });

      setUsers(usersWithRoleNames);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  useEffect(() => {
    // Obtener la lista de roles cuando se monte el componente
    async function fetchRoles() {
      try {
        const roles = await RoleService.getAllRoles();
        setRoles(roles);
      } catch (error) {
        console.error("Error al obtener roles:", error);
      }
    }
    fetchRoles();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData(user);
    setSelectedRole(user.roleCode);
    setOpenModal(true);
  };

  const handleDeleteUser = (userId, userName) => {
    setDeleteUserId(userId);
    setDeleteUserName(userName);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    setConfirmDeleteOpen(false);
    try {
      await AuthService.deleteUser(deleteUserId);
      setUsers(users.filter((user) => user._id !== deleteUserId));
      setSnackbarMessage(`El usuario ${deleteUserName} ha sido eliminado.`);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      setSnackbarMessage(
        "Error al eliminar usuario. Por favor, inténtalo de nuevo más tarde."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      await AuthService.updateUser(selectedUser._id, formData);
      setOpenModal(false);
      setSnackbarMessage("Usuario actualizado correctamente");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchUsers();
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      setSnackbarMessage(
        "Error al actualizar usuario. Por favor, inténtalo de nuevo más tarde."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Efecto para actualizar formData cuando cambia el selectedRole
  useEffect(() => {
    if (selectedUser) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        roleCode: selectedRole,
      }));
    }
  }, [selectedRole]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <Thead>
            <Tr>
              <Th>Nombre</Th>
              <Th>Apellido</Th>
              <Th>Email</Th>
              <Th>Fecha de Registro</Th>
              <Th>Rol</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentUsers.map(
              ({
                _id,
                first_name,
                last_name,
                email,
                date,
                roleCode,
                roleName,
              }) => {
                return (
                  <Tr key={_id}>
                    <Td>{first_name}</Td>
                    <Td>{last_name}</Td>
                    <Td>{email}</Td>
                    <Td>{formatDate(date)}</Td>
                    <Td>
                      {roleCode} - {roleName}
                    </Td>
                    <Td>
                      <IconButton
                        aria-label="Editar"
                        style={{ color: "blue" }}
                        onClick={() =>
                          handleEditUser({ _id, first_name, last_name, email, roleCode })
                        }
                      >
                        <Icon icon="mdi:account-edit" />
                      </IconButton>
                      <IconButton
                        aria-label="Eliminar"
                        style={{ color: "red" }}
                        onClick={() =>
                          handleDeleteUser(_id, `${first_name} ${last_name}`)
                        }
                      >
                        <Icon icon="mdi:account-remove" />
                      </IconButton>
                    </Td>
                  </Tr>
                );
              }
            )}
          </Tbody>
        </Table>
      </TableContainer>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </Button>
        <Button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastItem >= users.length}
        >
          Siguiente
        </Button>
      </div>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        closeAfterTransition
      >
        <Fade in={openModal}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <Box
              sx={{
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
                width: "600px",
              }}
            >
              <Typography
                variant="h6"
                id="modal-title"
                align="center"
                gutterBottom
              >
                Editar Usuario
              </Typography>

              <div style={{ padding: "20px" }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Nombre"
                      name="first_name"
                      variant="standard"
                      fullWidth
                      value={formData.first_name}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Apellido"
                      variant="standard"
                      name="last_name"
                      fullWidth
                      value={formData.last_name}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      variant="standard"
                      name="email"
                      fullWidth
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      select
                      label="Rol"
                      variant="standard"
                      name="roleCode"
                      fullWidth
                      value={selectedRole} 
                      onChange={(e) => setSelectedRole(e.target.value)} 
                    >
                      {roles.map((role) => (
                        <MenuItem key={role.code} value={role.code}>
                          {role.code} - {role.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Contraseña"
                      variant="standard"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      fullWidth
                      value={formData.password}
                      onChange={handleInputChange}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? (
                                <Icon icon="bi:eye-slash-fill" />
                              ) : (
                                <Icon icon="bi:eye-fill" />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
                <div
                  style={{
                    marginTop: "15px",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button variant="contained" onClick={handleSaveChanges}>
                    Guardar Cambios
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setOpenModal(false)}
                    style={{ marginLeft: "10px" }}
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            </Box>
          </div>
        </Fade>
      </Modal>

      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Eliminar Usuario"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Estás seguro de que deseas eliminar al usuario{" "}
            <strong>{deleteUserName}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

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
    </>
  );
};

export default UserTable;
