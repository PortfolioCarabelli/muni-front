import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import IncidenteService from "../../services/incident.service";
import { Pie, Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineController,
  LineElement,
  BarController,
  BarElement,
} from "chart.js";
import "./dashboard.css";
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineController,
  LineElement,
  BarController,
  BarElement
);

const Dashboard = () => {
  const [incidentes, setIncidentes] = useState([]);
  const [pendientes, setPendientes] = useState(0);
  const [desestimado, setDesestimado] = useState(0);
  const [enProgreso, setEnProgreso] = useState(0);
  const [cerrados, setCerrados] = useState(0);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMediumLargeScreen = useMediaQuery(
    theme.breakpoints.between("md", "lg")
  );
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [incidentesPorMes, setIncidentesPorMes] = useState({});
  const [incidentesPorSemana, setIncidentesPorSemana] = useState({});
  const [incidentesPorDia, setIncidentesPorDia] = useState({});
  useEffect(() => {
    const fetchIncidentes = async () => {
      try {
        const response = await IncidenteService.getAllIncidentes();
        console.log(response);
        const statePendiente = response.filter(
          (incidente) => incidente.estado === "Pendiente"
        );
        const stateDesestimado = response.filter(
          (incidente) => incidente.estado === "Desestimado"
        );
        const stateEnProgreso = response.filter(
          (incidente) => incidente.estado === "En progreso"
        );
        const stateCerrados = response.filter(
          (incidente) => incidente.estado === "Cerrado"
        );
        setPendientes(statePendiente.length);
        setIncidentes(response.data);
        setDesestimado(stateDesestimado.length);
        setEnProgreso(stateEnProgreso.length);
        setCerrados(stateCerrados.length);

        const incidentsByMonth = processIncidentsByMonth(response);
        setIncidentesPorMes(incidentsByMonth);
        // Process data for incidents by week
        const incidentsByWeek = processIncidentsByWeek(response);
        setIncidentesPorSemana(incidentsByWeek);
        const incidentsByDay = processIncidentsByDay(response);
        setIncidentesPorDia(incidentsByDay);
      } catch (error) {
        console.error("Error al obtener los incidentes:", error);
      }
    };

    fetchIncidentes();
  }, []);

  // Datos para el gráfico de barras
  const data = {
    labels: ["Pendiente", "Resuelto", "En progreso", "Cerrado"],
    datasets: [
      {
        label: "Cantidad de Incidentes por Estado",
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
        data: [pendientes, desestimado, enProgreso, cerrados],
      },
    ],
  };

  // Function to prepare chart data
  const prepareChartData = (data) => {
    return {
      labels: Object.keys(data),
      datasets: [
        {
          label: "Cantidad de Incidentes",
          backgroundColor: "rgba(75,192,192,0.2)",
          borderColor: "rgba(75,192,192,1)",
          borderWidth: 1,
          data: Object.values(data),
        },
      ],
    };
  };

  // Function to process incidents by month
  const processIncidentsByMonth = (incidents) => {
    const incidentsByMonth = {};
    incidents.forEach((incident) => {
      const month = new Date(incident.date).toLocaleString("default", {
        month: "long",
      });
      incidentsByMonth[month] = (incidentsByMonth[month] || 0) + 1;
    });
    return incidentsByMonth;
  };

  // Function to process incidents by week
  const processIncidentsByWeek = (incidents) => {
    const incidentsByWeek = {};
    incidents.forEach((incident) => {
      const week = getWeekNumber(new Date(incident.date));
      incidentsByWeek[`Semana ${week}`] =
        (incidentsByWeek[`Semana ${week}`] || 0) + 1;
    });
    return incidentsByWeek;
  };

  const processIncidentsByDay = (incidents) => {
    const incidentsByDay = {};
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 6); // Retrocede 6 días para incluir hoy
    incidents.forEach((incident) => {
      const incidentDate = new Date(incident.date);
      if (incidentDate >= oneWeekAgo && incidentDate <= today) {
        const day = incidentDate.toLocaleDateString();
        incidentsByDay[day] = (incidentsByDay[day] || 0) + 1;
      }
    });
    return incidentsByDay;
  };

  // Function to get week number
  const getWeekNumber = (date) => {
    const onejan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil(((date - onejan) / 86400000 + onejan.getDay() + 1) / 7);
  };

  const fontSizeTitle = isSmallScreen ? "h6" : "h5";
  const fontSizeSubtitle = isSmallScreen ? "body2" : "body1";

  let gridColumns = 12;

  if (isSmallScreen) {
    gridColumns = 12;
  } else if (isMediumScreen) {
    gridColumns = 10;
  } else if (isMediumLargeScreen) {
    gridColumns = 8;
  } else if (isLargeScreen) {
    gridColumns = 12;
  }

  return (
    <Grid
      container
      justifyContent={"center"}
      alignItems="center"
      sx={{ padding: "20px", borderRadius: "10px" }}
    >
      <Grid item container xs={gridColumns} spacing={3}>
        <Box
          sx={{
            color: "#007aff",
            textAlign: "center",
            fontWeight: "600",
            padding: "10px",
            width: "100%",
            borderRadius: "10px",
            marginBottom: "20px",
            marginTop: "20px",
          }}
        >
          <Typography
            fontWeight={600}
            variant={fontSizeTitle}
            color={"#153d6a"}
          >
            Dashboard de Incidentes
          </Typography>
        </Box>
        <Grid item container xs={12} justifyContent="center" spacing={3}>
          <Grid item container spacing={3} xs={12} md={8}>
            <Grid item xs={6} md={6} lg={3}>
              <Card className="dashboard-card">
                <div className="dashboard-bar"></div>
                <CardContent className="card-content">
                  <Stack spacing={3}>
                    <Typography
                      color="text.secondary"
                      variant={fontSizeSubtitle}
                    >
                      Pendientes
                    </Typography>
                    <Typography variant="h4" textAlign="end">
                      {pendientes}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={6} md={6} lg={3}>
              <Card className="dashboard-card">
                <div className="dashboard-bar"></div>
                <CardContent className="card-content">
                  <Stack spacing={3}>
                    <Typography
                      color="text.secondary"
                      variant={fontSizeSubtitle}
                    >
                      En Proceso
                    </Typography>
                    <Typography variant="h4" textAlign="end">
                      {enProgreso}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={6} lg={3}>
              <Card className="dashboard-card">
                <div className="dashboard-bar"></div>
                <CardContent className="card-content">
                  <Stack spacing={3}>
                    <Typography
                      color="text.secondary"
                      variant={fontSizeSubtitle}
                    >
                      Desestimado
                    </Typography>
                    <Typography variant="h4" textAlign="end">
                      {desestimado}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={6} lg={3}>
              <Card className="dashboard-card">
                <div className="dashboard-bar"></div>
                <CardContent className="card-content">
                  <Stack spacing={3}>
                    <Typography
                      color="text.secondary"
                      variant={fontSizeSubtitle}
                    >
                      Cerrados
                    </Typography>
                    <Typography variant="h4" textAlign="end">
                      {cerrados}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid item container xs={12} justifyContent="center" spacing={3}>
          <Grid
            container
            item
            xs={12}
            md={3}
            sx={{
              color: "#007aff",
              textAlign: "center",
              fontWeight: "600",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6">
                    Gráfico de Incidentes por Estado
                  </Typography>
                  <Pie
                    data={data}
                    style={{ maxWidth: "380px", maxHeight: "380px" }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid
            container
            item
            xs={12}
            md={3}
            sx={{
              color: "#007aff",
              textAlign: "center",
              fontWeight: "600",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            <Grid item xs={12} width={"100%"}>
              <Card>
                <CardContent >
                  <Typography variant="h6">
                    Ingresos de Incidentes por Día
                  </Typography>
                  <Line data={prepareChartData(incidentesPorDia)} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid item container xs={12} md={9} spacing={3}>
          <Grid
            container
            item
            xs={12}
            md={4}
            sx={{
              color: "#007aff",
              textAlign: "center",
              fontWeight: "600",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            {/* <Grid item xs={12} width={'100%'}>
              <Card>
                <CardContent className="card-content">
                  <Typography color="text.secondary" variant={fontSizeSubtitle}>
                    Ingresos de Incidentes por Mes
                  </Typography>
                  <Line data={prepareChartData(incidentesPorMes)} />
                </CardContent>
              </Card>
            </Grid> */}
          </Grid>
          <Grid
            container
            item
            xs={12}
            md={4}
            sx={{
              color: "#007aff",
              textAlign: "center",
              fontWeight: "600",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            {/* <Grid item xs={12} width={'100%'}>
              <Card>
                <CardContent className="card-content">
                  <Typography color="text.secondary" variant={fontSizeSubtitle}>
                    Ingresos de Incidentes por Semana
                  </Typography>
                  <Bar data={prepareChartData(incidentesPorSemana)} />
                </CardContent>
              </Card>
            </Grid> */}
          </Grid>
          <Grid
            container
            item
            xs={12}
            md={4}
            sx={{
              color: "#007aff",
              textAlign: "center",
              fontWeight: "600",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          ></Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
