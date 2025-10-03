import { Card, CardContent, Typography, Grid, Box } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleIcon from "@mui/icons-material/People";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BarChartIcon from "@mui/icons-material/BarChart";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const user = {
  name: "Anuraag Sharma",
  email: "anuraag@example.com",
  role: "Admin",
  joined: "2023-01-15",
};

const stats = [
  {
    title: "Total Users",
    value: 1240,
    icon: <PeopleIcon fontSize="large" />,
    gradient: "linear-gradient(135deg, #42a5f5 0%, #478ed1 100%)",
  },
  {
    title: "Revenue",
    value: "$23,400",
    icon: <AttachMoneyIcon fontSize="large" />,
    gradient: "linear-gradient(135deg, #66bb6a 0%, #4b9a50 100%)",
  },
  {
    title: "Growth",
    value: "12.5%",
    icon: <TrendingUpIcon fontSize="large" />,
    gradient: "linear-gradient(135deg, #ffa726 0%, #ff8f00 100%)",
  },
  {
    title: "Active Sessions",
    value: 320,
    icon: <BarChartIcon fontSize="large" />,
    gradient: "linear-gradient(135deg, #ab47bc 0%, #8e24aa 100%)",
  },
];

const chartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      label: "Monthly Users",
      data: [120, 190, 300, 500, 200, 300, 400],
      fill: true,
      backgroundColor: "rgba(66,165,245,0.2)",
      borderColor: "#42a5f5",
      tension: 0.4,
    },
  ],
};

const DashboardHeader = () => {
  return (
    <Box sx={{ minHeight: "100vh", p: { xs: 2, md: 4 }, background: "#f5f7fa" }}>
      {/* Welcome Card */}
      <Card
        sx={{
          mb: 4,
          p: { xs: 2, md: 3 },
          borderRadius: 3,
          background: "linear-gradient(90deg, #42a5f5 0%, #ab47bc 100%)",
          color: "#fff",
          boxShadow: 6,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Welcome, {user.name}
        </Typography>
        <Typography variant="subtitle1">{user.email}</Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Role: {user.role} | Joined: {user.joined}
        </Typography>
      </Card>

      {/* Stats Cards */}
      <Grid container spacing={{ xs: 2, md: 3 }} mb={4}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card
              sx={{
                background: stat.gradient,
                color: "#fff",
                borderRadius: 3,
                boxShadow: 4,
                transition: "transform 0.3s",
                "&:hover": { transform: "translateY(-5px)" },
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  {stat.icon}
                  <Typography variant="h6" ml={2}>
                    {stat.title}
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold">
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Chart Card */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 4,
          p: { xs: 2, md: 3 },
          background: "#fff",
        }}
      >
        <Typography variant="h6" mb={2} fontWeight="bold">
          User Growth Chart
        </Typography>
        <Line data={chartData} />
      </Card>
    </Box>
  );
};

export default DashboardHeader;
