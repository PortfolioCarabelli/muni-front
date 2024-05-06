import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  TextField,
  Grid,
  Snackbar,
  InputAdornment,
  IconButton,
  MenuItem,
} from "@mui/material";
import AuthService from "../../services/auth.service";
import RoleService from "../../services/role.service"; // Importa el servicio de roles
import MuiAlert from "@mui/material/Alert";
import Swal from "sweetalert2"; // Importar SweetAlert2
import { Icon } from "@iconify/react";
import CustomButton from "../CustomButton";

const UserForm = ({ onCloseForm,  updateUserTable }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar si se muestra la contraseña o no
  const [roles, setRoles] = useState([]); // Estado para almacenar la lista de roles

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

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const createUser = async (values) => {
    try {
      await AuthService.createUser(values);
      console.log("Usuario creado correctamente:", values);
      onCloseForm();
      setOpenSnackbar(true);

      // Mostrar una alerta de SweetAlert2 después de crear el usuario
      Swal.fire({
        icon: "success",
        title: "¡Usuario registrado correctamente!",
        showConfirmButton: false,
        timer: 2000, // Cerrar automáticamente después de 2 segundos
      });

      updateUserTable(); 
    } catch (error) {
      console.error("Error al crear usuario:", error);
    }
  };

  return (
    <Grid container>
      <Formik
        initialValues={{
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          roleCode: "",
        }}
        onSubmit={createUser} // Llama a la función createUser cuando se envía el formulario
      >
        {({ errors, touched }) => (
          <Form id="userForm" style={{ padding: "20px" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  label="Nombre"
                  id="first_name"
                  name="first_name"
                  variant="standard"
                  fullWidth
                />
                <ErrorMessage name="first_name" component="div" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  label="Apellido"
                  variant="standard"
                  id="last_name"
                  name="last_name"
                  fullWidth
                />
                <ErrorMessage name="last_name" component="div" />
              </Grid>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  label="Email"
                  variant="standard"
                  id="email"
                  name="email"
                  fullWidth
                />
                <ErrorMessage name="email" component="div" />
              </Grid>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  select
                  label="Rol"
                  variant="standard"
                  id="roleCode"
                  name="roleCode"
                  fullWidth
                >
                  {roles.map((role) => (
                    <MenuItem key={role.code} value={role.code}>
                      {role.code} - {role.name}
                    </MenuItem>
                  ))}
                </Field>
                <ErrorMessage name="roleCode" component="div" />
              </Grid>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  label="Contraseña"
                  variant="standard"
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"} // Cambiar el tipo de entrada según si se muestra la contraseña o no
                  fullWidth
                  InputProps={{
                    // Agregar un InputAdornment con un IconButton para mostrar/ocultar la contraseña
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
                <ErrorMessage name="password" component="div" />
              </Grid>
            </Grid>
            <Grid container style={{ marginTop: "15px" }}>
              <CustomButton
                text={"Guardar"}
                icon={<Icon icon="mingcute:save-2-line" />}
                type="submit"
                form="userForm"
              />
            </Grid>
          </Form>
        )}
      </Formik>
      {/* Snackbar para mostrar mensaje de confirmación */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity="success"
        >
          Usuario registrado correctamente
        </MuiAlert>
      </Snackbar>
    </Grid>
  );
};

export default UserForm;
