import { useState } from "react";
// === UI Components ===
import {
  Grid,
  Box,
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
import { Layout } from "antd";
import "antd/dist/antd.min.css";

// === Custom Components ===
import {
  Dashboard,
  CustomTitle,
  CustomPageHeader,
  CustomDescriptionBox,
} from "../components";

// === styles ===
import { sidebar_style } from "../global_styles";
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

// === sub component imports ===
const { Sider, Content } = Layout;

// ========================================================
const Interference = () => {
  // ========= states =========
  const [momentum, setMomentum] = useState("");
  const [spacing, setSpacing] = useState("");
  const [slit_separation, setSlitSeparation] = useState("");
  const [interference_2D_img, setInterference2DImg] = useState(
    "./model_images/interference/interference_2D_1x1x1.gif"
  );
  const [interference_3D_img, setInterference3DImg] = useState(
    "./model_images/interference/interference_3D_1x1x1.gif"
  );
  const [success_msg, setSuccessMsg] = useState(
    "Interference model generated with momentum = 1, spacing = 1, and slit separation = 1!"
  );
  const [open, setOpenSnackbar] = useState(false);

  // ========= handle functions =========
  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    // function to close the snackbar
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };
  const handleMomentum = (event: SelectChangeEvent) => {
    setMomentum(event.target.value as string);
    console.log(event.target.value);
  };
  const handleSpacing = (event: SelectChangeEvent) => {
    setSpacing(event.target.value as string);
    console.log(event.target.value);
  };
  const handleSlitSeparation = (event: SelectChangeEvent) => {
    setSlitSeparation(event.target.value as string);
    console.log(event.target.value);
  };
  function handleSubmit(event: any) {
    event.preventDefault();
    let momentum_str = momentum.toString();
    let spacing_str = spacing.toString();
    let slit_separation_str = slit_separation.toString();
    console.log("momentum:", momentum_str);
    console.log("spacing:", spacing_str);
    console.log("slit_separation:", slit_separation_str);

    // if no values are selected, set to default values
    if (momentum_str === "") {
      momentum_str = "1";
    }
    if (spacing_str === "") {
      spacing_str = "1";
    }
    if (slit_separation_str === "") {
      slit_separation_str = "1";
    }

    let img_path_2D =
      "./model_images/interference/interference_2D_" +
      momentum_str +
      "x" +
      spacing_str +
      "x" +
      slit_separation_str +
      ".gif";
    let img_path_3D =
      "./model_images/interference/interference_3D_" +
      momentum_str +
      "x" +
      spacing_str +
      "x" +
      slit_separation_str +
      ".gif";
    setInterference2DImg(img_path_2D);
    setInterference3DImg(img_path_3D);
    setSuccessMsg(
      "Interference model generated with momentum = " +
        momentum_str +
        ", spacing = " +
        spacing_str +
        ", and slit separation = " +
        slit_separation_str +
        "!"
    );
    setOpenSnackbar(true); // open snackbar
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        // collapsible
        // collapsed={collapsed}
        // onCollapse={(value) => setCollapsed(value)}
        style={sidebar_style}
      >
        <CustomTitle />
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
              <InputLabel id="momentum-select">Momentum</InputLabel>
              <Select
                labelId="barrier-select"
                id="barrier-select"
                value={momentum}
                label="Test"
                onChange={handleMomentum}
                defaultValue={"1"}
                style={select_style}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
              </Select>
            </FormControl>
            <FormControl variant="filled">
              <InputLabel id="spacing-select">Spacing</InputLabel>
              <Select
                labelId="spacing-select-label"
                id="spacing-select"
                value={spacing}
                label="Spacing"
                onChange={handleSpacing}
                defaultValue={"10"}
                style={select_style}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
              </Select>
            </FormControl>
            <FormControl variant="filled">
              <InputLabel id="slit-separation-input-label">
                Slit Separation
              </InputLabel>
              <Select
                labelId="slit_separation-select-label"
                id="slit_separation-select"
                value={slit_separation}
                label="slit_separation"
                onChange={handleSlitSeparation}
                defaultValue={"1"}
                style={select_style}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={5}>5</MenuItem>
              </Select>
            </FormControl>

            {/* ====== Submit Button ====== */}
            <Button
              variant="contained"
              onClick={handleSubmit}
              type="submit"
              color="success"
            >
              Generate Model
            </Button>

            {/* ====== Dashboard ====== */}
            <Dashboard />

            {/* ====== Snackbar ====== */}
            <Snackbar
              open={open}
              autoHideDuration={6000}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
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
      </Sider>
      <Content className="site-layout" style={{ margin: "5%" }}>
        <CustomPageHeader text="Interference" size="h3" />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <img
              src={interference_3D_img}
              alt="3D tunneling function"
              style={img_style}
            />
          </Grid>

          <Grid item xs={6}>
            <img
              src={interference_2D_img}
              alt="2D tunneling"
              style={img_style}
            />
          </Grid>
        </Grid>

        <CustomDescriptionBox
          msg={`Quantum interference states that elementary particles can not only be in more than one place at any given time (through superposition), but that an individual particle, such as a photon (light particles) can cross its own trajectory and interfere with the direction of its path.
          
          Particles in quantum mechanics behave very differently from those that we observe day-to-day in the realm of classical physics. Each particle behaves both as a solid object with a calculable energy and momentum and a wave with a calculable frequency and wavelength. This is only possible at incredibly low scale due to a phenomenon known as the “Wave-Particle Duality” as described by the DeBroglie Wavelength which dictates that all entities have a known frequency relative to the Planck’s Constant (6.63 * 10^-23) and its momentum.
          
          F = p/h
          
          Note that the frequency increases very quickly with momentum and thus the wavelength quickly becomes incalculably small unless the momentum is also suitably small, like for example, an electron or a photon as shown in this example.
          
          Shown is a classic demonstration of the Wave-Particle Duality by showing photons interfering with each other. Normally, when a light is shown at an object, the resulting shadow would simply be the negative of that object. However, in this example, where a beam of light is shown at a pair of slits, two slits do not form as a negative on the resulting side, but rather a periodic spectrum of dashes of diminishing intensity. If the photons were only particles, they should have been able to pass through theslits and carried on as there should have been no interfering obstacle but they not only appear to splash outwards from the slits, thus hinting at their wave-like nature, but the resulting waves interfere with each other thus suggesting contact interactions among the particles of each resultant waves. Shown is a top-down view of the experiment and a representation of reflection from the barrier to demonstrate that no interference is resultant from tunneling but only from the two resultant waves intersecting at regular angular intervals. Try altering the spacing and width of the slits and kinetic energy of the wave. How does the wavelengthof the incoming wave appear to change the size and frequency of the dashes on the wall? Does increasing or decreasing the kinetic energy of the wave affect the interference pattern? Why or why not?
          `}
        />
      </Content>
    </Layout>
  );
};

export default Interference;
