import React from "react";
import { Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <Grid
      container
      id="footerContainer"
      sx={{
        background: "#007aff",
        color: "#fff",
        padding: "20px 0",
        marginTop: "30px",
      }}
    >
      <Grid item xs={12}>
        <Typography variant="body1" align="center">
          Este es el pie de página de la aplicación.
        </Typography>
      </Grid>
      <Grid item xs={12} sx={{ marginTop: "10px" }}>
        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} Todos los derechos reservados.
        </Typography>
      </Grid>
    </Grid>
  );
}
