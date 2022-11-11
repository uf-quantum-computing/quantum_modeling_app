import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
// === UI Components ===
import { Layout } from "antd";
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
import { gators, bg_gradient } from "./images";
// === Components ===
import {
  CustomMenu,
  VerticalMenu,
  CustomDescriptionBox,
  CustomPageHeader,
  CustomTitle,
} from "./components";
// === sub component imports ===
const { Header, Content, Footer, Sider } = Layout;
// === styles ===
const sidebar_style = {
  backgroundColor: "#333333",
  height: "100vh",
  minHeight: "100vh",
};
const select_style = { backgroundColor: "#FFFFFF" };
const img_style = {
  borderRadius: "10px",
  boxShadow: "0 0 5px -1px rgba(0,0,0,0.2)",
  width: "100%",
};
const horizontal_center = {
  display: "flex",
  // alignItems: "center",  # vertical center
  justifyContent: "center",
};

// ========================================================
// ========= App ==========================================
// ========================================================
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
          <Route path="/test" element={<Test />} />
          <Route path="/tunneling" element={<Tunneling />} />
          <Route path="/wavefunction" element={<Wavefunction />} />
          <Route path="/interference" element={<Interference />} />
          {/* <Route path="/spin" element={<Spin />} /> */}
          {/* <Route path="/potential-barriers" element={<PotentialBarriers />} /> */}
        </Route>
      </Routes>
    </div>
  );
}

// ========================================================
// ========= Pages ========================================
// ========================================================
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
    "./model_images/tunneling/2DTunneling_1x1x1.gif"
  );
  const [tunneling_img3, set_Tunneling_img3d] = useState(
    "./model_images/tunneling/3DTunneling_1x1x1.gif"
  );
  const [success_msg, set_Success_Msg] = useState(
    "Wavefunction with mass = 1 & velocity = 10 generated!"
  );
  const [description_text, set_Description_Text] = useState(
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

    let img_path_2D =
      "./model_images/tunneling/2DTunneling_" +
      barrier_str +
      "x" +
      thickness_str +
      "x" +
      wave_str +
      ".gif";
    let img_path_3D =
      "./model_images/tunneling/3DTunneling_" +
      barrier_str +
      "x" +
      thickness_str +
      "x" +
      wave_str +
      ".gif";
    set_Tunneling_img2d(img_path_2D);
    set_Tunneling_img3d(img_path_3D);
    set_Description_Text(
      "Wavefunction with mass = " +
        barrier_str +
        " & velocity = " +
        wave_str +
        " generated!"
    );
    set_Success_Msg(
      "Wavefunction with barrier = " +
        barrier_str +
        " & thickness = " +
        thickness_str +
        " & wave = " +
        wave_str +
        " generated!"
    );
  }

  // ========= return =========
  return (
    <div>
      <Grid container spacing={2}>
        {/* ================== left col ================== */}
        <Grid item xs={3} style={sidebar_style}>
          <div style={horizontal_center}>
            <CustomTitle />
          </div>

          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
            style={horizontal_center}
          >
            <Stack spacing={3}>
              {/* ====== Select Inputs ====== */}
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

              {/* ====== Submit Button ====== */}
              <Button variant="contained" onClick={handleSubmit} type="submit">
                Generate Model
              </Button>

              {/* ====== VerticalMenu ====== */}
              <VerticalMenu />

              {/* ====== Snackbar ====== */}
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

        {/* ================== right col ================== */}
        <Grid item xs={8}>
          <CustomPageHeader text="Tunneling" size="h3" />

          <img src={tunneling_img2} alt="2D tunneling" style={img_style} />
          <img src={tunneling_img3} alt="3D tunneling function" />
          <CustomDescriptionBox msg={description_text} />
        </Grid>
      </Grid>
    </div>
  );
}

function Wavefunction() {
  // === state ===
  const [mass, setMass] = useState("");
  const [velocity, setVelocity] = useState("");
  const [wavefunction_img1, set_Wavefunction_Img1] = useState(
    "./model_images/wavefunction/wave_1x1.gif"
  );
  const [wavefunction_img2, set_Wavefunction_Img2] = useState(
    "./model_images/wavefunction/wave_density_1x1.gif"
  );
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

    let wave_img1_path =
      "./model_images/wavefunction/wave_" +
      mass_str +
      "x" +
      velocity_str +
      ".gif";
    let wave_img2_path =
      "./model_images/wavefunction/wave_density_" +
      mass_str +
      "x" +
      velocity_str +
      ".gif";
    console.log(wave_img1_path);
    console.log(wave_img2_path);
    set_Wavefunction_Img1(wave_img1_path);
    set_Wavefunction_Img2(wave_img2_path);
    set_Success_Msg(
      "Wavefunction with mass = " +
        mass_str +
        " & velocity = " +
        velocity_str +
        " generated!"
    );
    set_Description_Msg("Example Description Msg");
    setOpen(true);
  }

  // === return ===
  return (
    <div>
      <Grid container spacing={2}>
        {/* ================== left col ================== */}
        <Grid item xs={3} style={sidebar_style}>
          <div>
            <div style={horizontal_center}>
              <CustomTitle />
            </div>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "25ch" },
              }}
              noValidate
              autoComplete="off"
              style={horizontal_center}
            >
              <Stack spacing={3}>
                {/* selects */}
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

                {/* submit button */}
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  type="submit"
                >
                  Generate Model
                </Button>

                <VerticalMenu />

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
              </Stack>
            </Box>
          </div>
        </Grid>

        {/* ================== right col ================== */}
        <Grid item xs={8}>
          <CustomPageHeader text="Wavefunction" size="h3" />

          <img src={wavefunction_img1} alt="wave function" style={img_style} />
          <img src={wavefunction_img2} alt="wave function" style={img_style} />
          <CustomDescriptionBox msg={description_msg} />
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

function Test() {
  return (
    <Layout>
      <Sider>Sider</Sider>
      <Layout>
        <Header>Header</Header>
        <Content>Content</Content>
        <Footer>Footer</Footer>
      </Layout>
    </Layout>
  );
}

// function Spin() {
//   return (
//     <div>
//       <Typography variant="h4" gutterBottom>
//         Spin
//       </Typography>
//       <CustomMenu />
//     </div>
//   );
// }

// function PotentialBarriers() {
//   return (
//     <div>
//       <Typography variant="h4" gutterBottom>
//         Potential Barriers/Wells
//       </Typography>
//       <CustomMenu />
//     </div>
//   );
// }
