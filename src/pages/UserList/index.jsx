import { Dialog, DialogTitle, Grid, Typography, Button } from "@mui/material";
import UserForm from "../../components/UserForm";
import { useState } from "react";
import UserTable from "../../components/UserTable";

export default function UserList() {
  const [open, setOpen] = useState(false);
  const [userTableKey, setUserTableKey] = useState(0);

  const handleListItemClick = (value) => {
    setOpen(value);
  };

  const updateUserTable = () => {
    // Incrementar la clave de la tabla de usuarios para forzar una actualización
    setUserTableKey((prevKey) => prevKey + 1);
  };

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
          padding: "10px",
          width: "100%",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      >
        <Typography fontWeight={"600"} variant="h5" color="#153d6a">
          Listado de Usuarios
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
          sx={{ textTransform: "none", backgroundColor: '#153d6a' }}
          onClick={() => handleListItemClick(true)}
        >
          Crear usuario
        </Button>
      </Grid>
      <Grid item xs={10} marginTop={2}>
        <UserTable key={userTableKey} />
      </Grid>

      <Dialog onClose={() => handleListItemClick(false)} open={open}>
        <DialogTitle>Crear Usuario</DialogTitle>
        <UserForm
          onCloseForm={() => {
            handleListItemClick(false);
            updateUserTable();
          }}
        />
      </Dialog>
    </Grid>
  );
}
