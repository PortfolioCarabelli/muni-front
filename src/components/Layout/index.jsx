import React, { useEffect, useState } from "react";

import { Icon } from "@iconify/react";
import { Outlet } from "react-router-dom";
import {
  Box,
  Toolbar,
  IconButton,
  Grid,
  Typography,
  AppBar,
  Drawer,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Divider,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import logo from '../../assets/logo.png'

export default function Layout({ children }) {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    const storedFullName = localStorage.getItem("fullName");
    if (storedFullName) {
      setFullName(storedFullName);
    }
  });

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("roleCode");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleLinkClick = () => {
    window.open("https://codercraft.com.ar/", "_blank"); // Abre la URL en una nueva pestaña
  };

  return (
    <Grid
      data-testid="layout-test"
      sx={{ display: "flex", flexDirection: "column", height: "100vh" }}
    >
      <AppBar position="static" style={{backgroundColor: '#153d6a'}}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
        
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer(true)}
            >
              <Icon icon="iconamoon:menu-burger-horizontal-fill" />
            </IconButton>
     
          {/* <Typography
            variant="h6"
            component="div"
            sx={{ cursor: "pointer" }}
            
          >
            Municipalidad
          </Typography> */}
          <img src={logo} alt='logo' onClick={() => navigate("/")} style={{width: '140px', height: '80px'}}/>
         
            <Tooltip title="Cerrar sesión">
              <Icon
                icon="solar:logout-3-line-duotone"
                onClick={handleLogout}
                style={{ cursor: "pointer", width: "32px", height: "32px" }}
              />
            </Tooltip>          
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer open={open} onClose={toggleDrawer(false)}>
          <ListItem disablePadding>
            <ListItemButton>
              <Grid container direction="column" alignItems="center">
                <Grid item>
                  <Icon
                    icon="ic:baseline-account-circle"
                    style={{ fontSize: 48 }}
                  />
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1" align="center">
                    {fullName}
                  </Typography>
                </Grid>
              </Grid>
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem
            disablePadding
            onClick={() => {
              navigate("/");
              setOpen(false);
            }}
          >
            <ListItemButton>
              <ListItemIcon>
                <Icon icon="ri:home-fill" width={"24px"} height={"24px"} />
              </ListItemIcon>
              <ListItemText primary={"Inicio"} />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem
            disablePadding
            onClick={() => {
              navigate("/product-list");
              setOpen(false);
            }}
          >
            <ListItemButton>
              <ListItemIcon>
                <Icon
                  icon="material-symbols-light:list-alt"
                  width={"24px"}
                  height={"24px"}
                />
              </ListItemIcon>
              <ListItemText primary={"Listado de reclamos"} />
            </ListItemButton>
          </ListItem>
          <ListItem
            disablePadding
            onClick={() => {
              navigate("/user-list");
              setOpen(false);
            }}
          >
            <ListItemButton>
              <ListItemIcon>
                <Icon icon="ph:user-list-fill" width={"24px"} height={"24px"} />
              </ListItemIcon>
              <ListItemText primary={"Listado de Usuarios"} />
            </ListItemButton>
          </ListItem>
        </Drawer>
      </Box>
      <Grid container id="main" sx={{ height: "100vh" }}>
        <Outlet />
      </Grid>
    </Grid>
  );
}
