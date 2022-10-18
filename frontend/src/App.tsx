import { Routes, Route, Link } from "react-router-dom";
// ==== UI Components ====
// import { Home } from "./pages";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
// ==== Backend Components ====
const axios = require("axios").default;

// =========================================
// ============= App =======================
// =========================================
export default function App() {
  return (
    <Container maxWidth="lg">
      <Typography variant="h2" gutterBottom style={{ marginTop: "2%" }}>
        Quantum Visualization
      </Typography>

      <Stack direction="row" spacing={2} style={{ marginBottom: "2%" }}>
        <Link to="/tunneling" style={{ textDecoration: "none" }}>
          <Button variant="outlined">Tunneling</Button>
        </Link>
        <Link to="/interference" style={{ textDecoration: "none" }}>
          <Button variant="outlined">Interference</Button>
        </Link>
        <Link to="/spin" style={{ textDecoration: "none" }}>
          <Button variant="outlined">Spin</Button>
        </Link>
        <Link to="/wave-function" style={{ textDecoration: "none" }}>
          <Button variant="outlined">Wave Function</Button>
        </Link>
        <Link to="/potential-barriers" style={{ textDecoration: "none" }}>
          <Button variant="outlined">Potential Barriers/Wells</Button>
        </Link>
        <Link to="/test" style={{ textDecoration: "none" }}>
          <Button variant="outlined">Test</Button>
        </Link>
      </Stack>

      <Routes>
        <Route path="/">
          <Route index element={<Dashboard />} />
          <Route path="*" element={<NoMatch />} />
          <Route path="/tunneling" element={<Tunneling />} />
          <Route path="/interference" element={<Interference />} />
          <Route path="/spin" element={<Spin />} />
          <Route path="/wave-function" element={<Wave_Function />} />
          <Route path="/potential-barriers" element={<Potential_Barriers />} />
          <Route path="/test" element={<Test_UI />} />
        </Route>
      </Routes>
    </Container>
  );
}

// ============= POST requests =============

function post_test(par_1: any, par_2: any) {
  axios
    .post("http://localhost:9000/test2", {
      par1: par_1,
      par2: par_2,
    })
    .then(function (response: any) {
      console.log(par_1 + par_2);
    })
    .catch(function (error: any) {
      console.log(error);
    });
}

function generate_tunneling_model(params: any) {
  axios
    .post("/tunneling", {
      firstName: "Fred",
      lastName: "Flintstone",
    })
    .then(function (response: any) {
      console.log(response);
    })
    .catch(function (error: any) {
      console.log(error);
    });
}
function generate_interference_model(params: any) {
  axios
    .post("/interference", {
      firstName: "Fred",
      lastName: "Flintstone",
    })
    .then(function (response: any) {
      console.log(response);
    })
    .catch(function (error: any) {
      console.log(error);
    });
}
function generate_spin_model(params: any) {
  axios
    .post("/spin", {
      firstName: "Fred",
      lastName: "Flintstone",
    })
    .then(function (response: any) {
      console.log(response);
    })
    .catch(function (error: any) {
      console.log(error);
    });
}
function generate_wave_function_model(params: any) {
  axios
    .post("/wave-function", {
      firstName: "Fred",
      lastName: "Flintstone",
    })
    .then(function (response: any) {
      console.log(response);
    })
    .catch(function (error: any) {
      console.log(error);
    });
}
function generate_potential_barriers_model(params: any) {
  axios
    .post("/potential-barriers", {
      firstName: "Fred",
      lastName: "Flintstone",
    })
    .then(function (response: any) {
      console.log(response);
    })
    .catch(function (error: any) {
      console.log(error);
    });
}

// ============= PAGES =============
function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Home
      </Typography>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

function Tunneling() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Tunneling
      </Typography>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>

      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <Stack spacing={2}>
              <TextField
                multiline
                id="outlined-basic"
                label="Outlined"
                variant="outlined"
              />
              <TextField
                multiline
                id="outlined-basic"
                label="Outlined"
                variant="outlined"
              />
              <TextField
                multiline
                id="outlined-basic"
                label="Outlined"
                variant="outlined"
              />
              <TextField
                multiline
                id="outlined-basic"
                label="Outlined"
                variant="outlined"
              />
              <Button
                variant="contained"
                onClick={() => {
                  alert("clicked");
                }}
              >
                Generate Model
              </Button>
            </Stack>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box
            sx={{
              width: 300,
              height: 300,
              backgroundColor: "text.disabled",
              "&:hover": {
                backgroundColor: "text.secondary",
                opacity: [0.9, 0.8, 0.7],
              },
              borderRadius: 2,
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
}

function Interference() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Interference
      </Typography>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

function Spin() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Spin
      </Typography>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

function Wave_Function() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Wave Function
      </Typography>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

function Potential_Barriers() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Potential Barriers/Wells
      </Typography>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

function Test_UI() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Test UI
      </Typography>
      <Button
        variant="contained"
        onClick={() => {
          post_test("beep", "boop");
        }}
      >
        Generate Model
      </Button>
    </div>
  );
}
