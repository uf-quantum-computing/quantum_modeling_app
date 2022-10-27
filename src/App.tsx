import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
// ==== UI Components ====
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  Slider,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
// ==== Images ====
import { wave_5x5, wave_1x10 } from "./images";
// ==== Backend Components ====
const axios = require("axios").default;

// =========================================
// ============= App =======================
// =========================================
export default function App() {
  return (
    <Container maxWidth="lg">
      <Typography variant="h2" gutterBottom style={{ marginTop: "2%" }}>
        <b>Quantum Modeling</b>
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
        <Link to="/wavefunction" style={{ textDecoration: "none" }}>
          <Button variant="outlined">Wave Function</Button>
        </Link>
        <Link to="/potential-barriers" style={{ textDecoration: "none" }}>
          <Button variant="outlined">Potential Barriers/Wells</Button>
        </Link>
      </Stack>

      <Routes>
        <Route path="/">
          <Route index element={<Dashboard />} />
          <Route path="*" element={<NoMatch />} />
          <Route path="/tunneling" element={<Tunneling />} />
          <Route path="/interference" element={<Interference />} />
          <Route path="/spin" element={<Spin />} />
          <Route path="/wavefunction" element={<Wavefunction />} />
          <Route path="/potential-barriers" element={<Potential_Barriers />} />
        </Route>
      </Routes>
    </Container>
  );
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

function Wavefunction() {
  const [mass, setMass] = useState("");
  const [velocity, setVelocity] = useState("");
  const [wavefunction_img, set_Wavefunction_img] = useState(wave_1x10);
  const [model_title, set_Model_Title] = useState(
    "Wavefunction with mass = 1 and velocity = 10 generated!"
  );

  const handleMass = (event: SelectChangeEvent) => {
    setMass(event.target.value as string);
    console.log(event.target.value);
  };

  const handleVelocity = (event: SelectChangeEvent) => {
    setVelocity(event.target.value as string);
    console.log(event.target.value);
  };

  function handleSubmit(event: any) {
    event.preventDefault();
    console.log("mass:", mass);
    console.log("velocity:", velocity);
    if (mass == "1" && velocity == "10") {
      console.log("1x10");
      set_Wavefunction_img(wave_1x10);
      set_Model_Title(
        "Wavefunction with mass = 1 and velocity = 10 generated!"
      );
    } else if (mass == "5" && velocity == "5") {
      console.log("5x5");
      set_Wavefunction_img(wave_5x5);
    } else {
      set_Wavefunction_img(wave_1x10);
      console.log("Default image is 1x10");
    }
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Wave Function
      </Typography>
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
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={mass}
                label="Test"
                onChange={handleMass}
                defaultValue={"1"}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
              </Select>

              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={velocity}
                label="Test"
                onChange={handleVelocity}
                defaultValue={"10"}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
              </Select>

              <Button variant="contained" onClick={handleSubmit} type="submit">
                Generate Model
              </Button>

              <p>{model_title}</p>
            </Stack>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <img src={wavefunction_img} alt="wave function" />
        </Grid>
      </Grid>
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
