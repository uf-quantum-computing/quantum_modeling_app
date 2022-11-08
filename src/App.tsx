import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
// === UI Components ===
import {
  Grid,
  Box,
  Typography,
  Button,
  Stack,
  Select,
  MenuItem,
  SelectChangeEvent,
  Alert,
  Snackbar,
  InputLabel,
  FormControl,
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
import { gators, bg_gradient } from "./images";
import {
  tunneling_1x1x1_2d,
  tunneling_1x3x5_2d,
  tunneling_1x1x1_3d,
  tunneling_1x3x5_3d,
} from "./images";
// === Components ===
import { CustomMenu, CustomDescriptionBox } from "./components";
// === styles ===
const sidebar_style = {
  backgroundColor: "#333333",
  height: "100vh",
  display: "flex",
  // alignItems: "center",
  justifyContent: "center",
};
const select_style = { backgroundColor: "#FFFFFF" };
const img_style = {
  borderRadius: "10px",
  boxShadow: "0 0 5px -1px rgba(0,0,0,0.2)",
  width: "100%",
};

// ============================
// ========= App ================
// ============================
export default function App() {
  // ========= return =========
  return (
    <div>
      {/* ==============  Routes ============== */}
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="*" element={<NoMatch />} />
          <Route path="/home2" element={<Home2 />} />
          <Route path="/tunneling" element={<Tunneling />} />
          <Route path="/interference" element={<Interference />} />
          <Route path="/spin" element={<Spin />} />
          <Route path="/wavefunction" element={<Wavefunction />} />
          <Route path="/potential-barriers" element={<PotentialBarriers />} />
        </Route>
      </Routes>
    </div>
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

function Home() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Home
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Typography variant="body1" gutterBottom>
            Welcome to the Quantum Computing Lab at the University of Florida!
            Our team works under Dr. Jing Guo in the Electrical Engineering
            Department and we've been working on creating more accessibility in
            the field of quantum computing. We build this website so that anyone
            can explore and have fun with these concepts.
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <img
            src={gators}
            alt="University of Florida"
            width="90%"
            height="auto"
          />
        </Grid>
      </Grid>
      <br></br>
      <br></br>
      <Typography variant="h6" gutterBottom>
        How this website works:
      </Typography>
      <Typography variant="body1" gutterBottom>
        Click on one of the buttons below and it will take you to quantum
        phenomena you can experiment with. Once you're there, you can try out
        different inputs and an animation will pop up! For example, you can go
        to the tunneling phenomena and play around with the momentum and barrier
        thickness. We'll have descriptions of whats happening on each page, so
        you'll be able to understand exactly what's happening. Have fun!
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

function Home2() {
  return (
    <div>
      <div
        style={{
          backgroundImage: `url(${bg_gradient})`,
          backgroundSize: "cover",
          minHeight: "100vh",
        }}
      ></div>
    </div>
  );
}

function Tunneling() {
  // ========= states =========
  const [barrier, setBarrier] = useState("");
  const [thickness, setThickness] = useState("");
  const [wave, setWave] = useState("");
  const [tunneling_img2, set_Tunneling_img2d] = useState(
    "./images/tunneling/2DTunneling_1x1x1.gif"
  );
  const [tunneling_img3, set_Tunneling_img3d] = useState(
    "./images/tunneling/3DTunneling_1x1x1.gif"
  );
  const [success_msg, set_Success_Msg] = useState(
    "Wavefunction with mass = 1 & velocity = 10 generated!"
  );
  // const [description_msg, set_Description_Msg] = useState(
  //   "Example Description Msg"
  // );
  const [open, setOpen] = useState(false);

  // ========= handle functions =========
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

    let image_str = "";
    // ======= GIF logic =======
    if (barrier_str === "1") {
      if (thickness_str === "1") {
      }
    } else if (barrier_str === "3") {
      image_str = image_str + "3";
    } else if (barrier_str === "5") {
      image_str = image_str + "5";
    }

    image_str = image_str + "x";
    console.log("image:", image_str);

    if (thickness_str === "1") {
      image_str = image_str + "1";
    } else if (thickness_str === "3") {
      image_str = image_str + "3";
    } else if (thickness_str === "5") {
      image_str = image_str + "5";
    }

    image_str = image_str + "x";
    console.log("image:", image_str);

    if (wave_str === "1") {
      image_str = image_str + "1";
    } else if (wave_str === "5") {
      image_str = image_str + "5";
    } else if (wave_str === "10") {
      image_str = image_str + "10";
    }

    console.log("image:", image_str);

    if (image_str === "tunneling_1x1x1") {
      set_Tunneling_img2d(tunneling_1x1x1_2d);
      set_Tunneling_img3d(tunneling_1x1x1_3d);
      set_Success_Msg(
        "Tunneling Function with barrier: 1, thickness: 1, wave intensity: 1!"
      );
      setOpen(true);
    } else if (image_str === "tunneling_1x3x5") {
      set_Tunneling_img2d(tunneling_1x3x5_2d);
      set_Tunneling_img3d(tunneling_1x3x5_3d);
      set_Success_Msg(
        "Tunneling Function with barrier: 1, thickness: 3, wave intensity: 5!"
      );
      setOpen(true);
    }
  }

  // ========= return =========
  return (
    <div>
      <Grid container spacing={2}>
        {/* ================== left col ================== */}
        <Grid item xs={3} style={sidebar_style}>
          <div>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "25ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <Stack spacing={3}>
                <FormControl variant="filled">
                  <InputLabel id="barrier-select">Barrier</InputLabel>
                  <Select
                    labelId="barrier-select"
                    id="barrier-select"
                    value={barrier}
                    label="Test"
                    onChange={handleBarrier}
                    defaultValue={"1"}
                    style={select_style}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                  </Select>
                </FormControl>
                <FormControl variant="filled">
                  <InputLabel id="thickness-select">Thickness</InputLabel>
                  <Select
                    labelId="thickness-select-label"
                    id="thickness-select"
                    value={thickness}
                    label="Thickness"
                    onChange={handleThickness}
                    defaultValue={"10"}
                    style={select_style}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                  </Select>
                </FormControl>

                <FormControl variant="filled">
                  <InputLabel id="wave-input-label">Wave</InputLabel>
                  <Select
                    labelId="wave-select-label"
                    id="wave-select"
                    value={wave}
                    label="Wave"
                    onChange={handleWave}
                    defaultValue={"1"}
                    style={select_style}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  type="submit"
                >
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
          </div>
        </Grid>

        {/* ================== right col ================== */}
        <Grid item>
          <Typography variant="h3" gutterBottom>
            Tunneling
          </Typography>
          <CustomMenu />
          <img
            src={tunneling_img2}
            alt="2D tunneling function"
            style={img_style}
          />
          <img src={tunneling_img3} alt="3D tunneling function" />
          <CustomDescriptionBox msg={success_msg} />
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
      <CustomMenu />
    </div>
  );
}

function Spin() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Spin
      </Typography>
      <CustomMenu />
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

    // === generate wavefunction ===
    if (mass_str === "1" && velocity_str === "1") {
      console.log("1x1");
      set_Wavefunction_img(wave_1x1);
      set_Success_Msg("Wavefunction with mass = 1 & velocity = 1 generated!");
      set_Description_Msg("Example Description Msg");
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
      <Grid container spacing={2}>
        {/* ================== left col ================== */}
        <Grid item xs={3} style={sidebar_style}>
          <div>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "25ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <FormControl fullWidth variant="filled">
                <InputLabel id="mass-label">Mass</InputLabel>
                <Select
                  labelId="mass-label"
                  id="mass-label-select"
                  value={mass}
                  label="Mass"
                  onChange={handleMass}
                  defaultValue={"1"}
                  style={select_style}
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth variant="filled">
                <InputLabel id="velocity-label">Velocity</InputLabel>
                <Select
                  labelId="velocity-label"
                  id="velocity-select"
                  value={velocity}
                  label="Test"
                  onChange={handleVelocity}
                  defaultValue={"10"}
                  style={select_style}
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                </Select>
              </FormControl>

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
            </Box>
          </div>
        </Grid>

        {/* ================== right col ================== */}
        <Grid item>
          <Typography variant="h3" gutterBottom>
            Wave Function
          </Typography>
          <CustomMenu />
          <img src={wavefunction_img} alt="wave function" style={img_style} />
          <CustomDescriptionBox msg={description_msg} />
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
      <CustomMenu />
    </div>
  );
}
