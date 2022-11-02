import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
// === UI Components ===
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  Select,
  MenuItem,
  SelectChangeEvent,
  Alert,
  Snackbar,
  Card,
  CardContent,
  InputLabel,
  FormControl,
  Divider,
} from "@mui/material";
// === Images ===
import {
  wave_1x1,
  wave_1x5,
  wave_1x10,
  wave_5x1,
  wave_5x5,
  wave_5x10,
  wave_10x1,
  wave_10x5,
  wave_10x10,
} from "./images";
import {
  gators,
} from "./images"
import {
  tunneling_1x1x1_2d,
  tunneling_1x3x5_2d,
  tunneling_1x1x1_3d,
  tunneling_1x3x5_3d,
} from "./images";

// ============================
// ========= App ================
// ============================
export default function App() {
  return (
    <Container maxWidth="md">
      <Typography variant="h2" gutterBottom style={{ marginTop: "2%" }}>
        <b>Quantum Modeling</b>
      </Typography>

      <Stack direction="row" spacing={2} style={{ marginBottom: "2%" }}>
      <Link to="/" style={{ textDecoration: "none" }}>
          <Button variant="outlined">Home</Button>
        </Link>
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
          <Route path="/potential-barriers" element={<PotentialBarriers />} />
        </Route>
      </Routes>
    </Container>
  );
}

// ========= PAGES =========
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
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Typography variant="body1" gutterBottom>
          Welcome to the Quantum Computing Lab at the University of Florida! Our team
          works under Dr. Jing Guo in the Electrical Engineering Department and we've 
          been working on creating more accessibility in the field of quantum computing.
          We build this website so that anyone can explore and have fun with these concepts. 
          </Typography>
        </Grid>
      <Grid item xs={4}>
          <img src={gators} alt="University of Florida" width="90%" height="auto" />
        </Grid>
      </Grid>
      <br></br>
      <br></br>
      <Typography variant="h6" gutterBottom>
        How this website works:
      </Typography>
      <Typography variant="body1" gutterBottom>
        Click on one of the buttons below and it will take you to 
        quantum phenomena you can experiment with. Once you're there, you can try out different inputs
        and an animation will pop up! For example, you can go to the tunneling phenomena and play around
        with the momentum and barrier thickness. We'll have descriptions of whats happening on each page, 
        so you'll be able to understand exactly what's happening. Have fun!
      </Typography>
      <br></br>
      <br></br>
      <Stack direction="row" spacing={2} style={{ marginBottom: "2%" }}>
        <Link to="/tunneling" style={{ textDecoration: "none" }}>
          <Button variant="contained">Tunneling</Button>
        </Link>
        <Link to="/interference" style={{ textDecoration: "none" }}>
          <Button variant="contained">Interference</Button>
        </Link>
        <Link to="/spin" style={{ textDecoration: "none" }}>
          <Button variant="contained">Spin</Button>
        </Link>
        <Link to="/wavefunction" style={{ textDecoration: "none" }}>
          <Button variant="contained">Wave Function</Button>
        </Link>
        <Link to="/potential-barriers" style={{ textDecoration: "none" }}>
          <Button variant="contained">Potential Barriers/Wells</Button>
        </Link>
      </Stack>

    </div>
  );
}

function Tunneling() {
  const [barrier, setBarrier] = useState("");
  const [thickness, setThickness] = useState("");
  const [wave, setWave] = useState("");
  const [tunneling_img2, set_Tunneling_img2d] = useState(tunneling_1x1x1_2d);
  const [tunneling_img3, set_Tunneling_img3d] = useState(tunneling_1x1x1_3d);
  const [success_msg, set_Success_Msg] = useState(
    "Wavefunction with mass = 1 & velocity = 10 generated!"
  );
  const [description_msg, set_Description_Msg] = useState(
    "Example Description Msg"
  );
  const [open, setOpen] = useState(false);

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    // function to close the snackbar
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleBarrier = (event: SelectChangeEvent) => {
    setBarrier(event.target.value as string);
    console.log(event.target.value);
  };

  const handleThickness = (event: SelectChangeEvent) => {
    setThickness(event.target.value as string);
    console.log(event.target.value);
  };

  const handleWave = (event: SelectChangeEvent) => {
    setWave(event.target.value as string);
    console.log(event.target.value);
  };

  function handleSubmit(event: any) {
    event.preventDefault();
    let barrier_str = barrier.toString();
    let thickness_str = thickness.toString();
    let wave_str = wave.toString();
    console.log("barrier:", barrier_str);
    console.log("thickness:", thickness_str);
    console.log("wave:", wave_str);

    let image_str = 'tunneling_';

    if (barrier_str === "1"){
      image_str = image_str + '1';
    } else if (barrier_str === "3"){
      image_str = image_str + '3';
    } else if (barrier_str === "5"){
      image_str = image_str + '5';
    }

    image_str = image_str + 'x';
    console.log("image:", image_str);

    if (thickness_str === "1"){
      image_str = image_str + '1';
    } else if (thickness_str === "3"){
      image_str = image_str + '3';
    } else if (thickness_str === "5"){
      image_str = image_str + '5';
    }

    image_str = image_str + 'x';
    console.log("image:", image_str);

    if (wave_str === "1"){
      image_str = image_str + '1';
    } else if (wave_str === "5"){
      image_str = image_str + '5';
    } else if (wave_str === "10"){
      image_str = image_str + '10';
    }

    console.log("image:", image_str);

    if(image_str === 'tunneling_1x1x1'){
      set_Tunneling_img2d(tunneling_1x1x1_2d);
      set_Tunneling_img3d(tunneling_1x1x1_3d);
      set_Success_Msg("Tunneling Function with barrier: 1, thickness: 1, wave intensity: 1!");
      setOpen(true);
    }else if(image_str === 'tunneling_1x3x5'){
      set_Tunneling_img2d(tunneling_1x3x5_2d);
      set_Tunneling_img3d(tunneling_1x3x5_3d);
      set_Success_Msg("Tunneling Function with barrier: 1, thickness: 3, wave intensity: 5!");
      setOpen(true);
    }

  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Tunneling
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
            <Stack spacing={3}>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={barrier}
                label="Test"
                onChange={handleBarrier}
                defaultValue={"1"}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={5}>5</MenuItem>
              </Select>

              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={thickness}
                label="Test"
                onChange={handleThickness}
                defaultValue={"10"}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={5}>5</MenuItem>
              </Select>

              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={wave}
                label="Test"
                onChange={handleWave}
                defaultValue={"1"}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
              </Select>

              <Button variant="contained" onClick={handleSubmit} type="submit">
                Generate Model
              </Button>

              <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
              >
                <Alert
                  onClose={handleClose}
                  severity="success"
                  sx={{ width: "100%" }}
                >
                  {success_msg}
                </Alert>
              </Snackbar>

              {/* <p>{success_msg}</p> */}
            </Stack>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <img src={tunneling_img2} alt="2D tunneling function" />
          <img src={tunneling_img3} alt="3D tunneling function" />
          <Card sx={{ minWidth: 400 }} variant="outlined">
            <CardContent>
              <Typography variant="body1">{success_msg}</Typography>
            </CardContent>
          </Card>
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
    </div>
  );
}

function Spin() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Spin
      </Typography>
    </div>
  );
}

function Wavefunction() {
  // === state ===
  const [mass, setMass] = useState("");
  const [velocity, setVelocity] = useState("");
  const [wavefunction_img, set_Wavefunction_img] = useState(wave_1x10);
  const [success_msg, set_Success_Msg] = useState(
    "Wavefunction with mass = 1 & velocity = 10 generated!"
  );
  const [description_msg, set_Description_Msg] = useState(
    "Example Description Msg"
  );
  const [open, setOpen] = useState(false);

  // === handle functions ===
  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    // function to close the snackbar
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
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
    let mass_str = mass.toString();
    let velocity_str = velocity.toString();
    console.log("mass:", mass_str);
    console.log("velocity:", velocity_str);

    if (mass_str === "1" && velocity_str === "1") {
      console.log("1x1");
      set_Wavefunction_img(wave_1x1);
      set_Success_Msg("Wavefunction with mass = 1 & velocity = 1 generated!");
      setOpen(true);
    } else if (mass_str === "1" && velocity_str === "5") {
      console.log("1x5");
      set_Wavefunction_img(wave_1x5);
      set_Success_Msg("Wavefunction with mass = 1 & velocity = 5 generated!");
      setOpen(true);
    } else if (mass_str === "1" && velocity_str === "10") {
      console.log("1x10");
      set_Wavefunction_img(wave_1x10);
      set_Success_Msg("Wavefunction with mass = 1 & velocity = 10 generated!");
      setOpen(true);
    } else if (mass_str === "5" && velocity_str === "1") {
      set_Wavefunction_img(wave_5x1);
      set_Success_Msg("Wavefunction with mass = 5 & velocity = 1 generated!");
      setOpen(true);
    } else if (mass_str === "5" && velocity_str === "5") {
      set_Wavefunction_img(wave_5x5);
      set_Success_Msg("Wavefunction with mass = 5 & velocity = 5 generated!");
      setOpen(true);
    } else if (mass_str === "5" && velocity_str === "10") {
      set_Wavefunction_img(wave_5x10);
      set_Success_Msg("Wavefunction with mass = 5 & velocity = 10 generated!");
      setOpen(true);
    } else if (mass_str === "10" && velocity_str === "1") {
      set_Wavefunction_img(wave_10x1);
      set_Success_Msg("Wavefunction with mass = 10 & velocity = 1 generated!");
      setOpen(true);
    } else if (mass_str === "10" && velocity_str === "5") {
      set_Wavefunction_img(wave_10x5);
      set_Success_Msg("Wavefunction with mass = 10 & velocity = 5 generated!");
      setOpen(true);
    } else if (mass_str === "10" && velocity_str === "10") {
      console.log("10x10");
      set_Wavefunction_img(wave_10x10);
      set_Success_Msg("Wavefunction with mass = 10 & velocity = 10 generated!");
      setOpen(true);
    }
  }

  // === return ===
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
            <FormControl fullWidth>
              <InputLabel id="mass-label">Mass</InputLabel>
              <Select
                labelId="mass-label"
                id="mass-label-select"
                value={mass}
                label="Mass"
                onChange={handleMass}
                defaultValue={"1"}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="velocity-label">Velocity</InputLabel>
              <Select
                labelId="velocity-label"
                id="velocity-select"
                value={velocity}
                label="Test"
                onChange={handleVelocity}
                defaultValue={"10"}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
              </Select>
            </FormControl>

            <Button variant="contained" onClick={handleSubmit} type="submit">
              Generate Model
            </Button>

            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
              <Alert
                onClose={handleClose}
                severity="success"
                sx={{ width: "100%" }}
              >
                {success_msg}
              </Alert>
            </Snackbar>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <img src={wavefunction_img} alt="wave function" />
          <Card sx={{ minWidth: 275 }} variant="outlined">
            <CardContent>
              <Typography variant="body1">{description_msg}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

function PotentialBarriers() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Potential Barriers/Wells
      </Typography>
    </div>
  );
}
