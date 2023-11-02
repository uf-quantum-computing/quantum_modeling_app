import React from "react";
import { useState } from "react";
// === UI Components ===
import {
  Grid,
  Box,
  Button,
  Stack,
  SelectChangeEvent,
  Alert,
  Snackbar,
  InputLabel,
  FormControl,
  Slider
} from "@mui/material";
import { Layout } from "antd";
import "antd/dist/antd.min.css";
import { sidebar_style } from "../global_styles";
// === Components ===
import {
  Dashboard,
  CustomDescriptionBox,
  CustomPageHeader,
  CustomTitle,
} from "../components";

// === sub component imports ===
const { Sider, Content } = Layout;

// === styles ===
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

const Wavefunction = () => {
  // === state ===
  const [mass, setMass] = useState("");
  const [velocity, setVelocity] = useState("");
  const [wavefunction_img1, set_Wavefunction_Img1] = useState(
    "./model_images/wavefunction/wavefunction_1x1.gif"
  );
  const [wavefunction_img2, set_Wavefunction_Img2] = useState(
    "./model_images/wavefunction/wavefunction_probDensity_1x1.gif"
  );
  const [success_msg, set_Success_Msg] = useState(
    "Wavefunction with mass = 1 & velocity = 10 generated!"
  );
  const [open, setOpenSnackbar] = useState(false);

  // === handle functions ===
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

    // if no input is selected, set to default values
    if (mass_str === "") {
      mass_str = "0.5";
    }
    if (velocity_str === "") {
      velocity_str = "0.5";
    }

    let wave_img1_path =
      "./model_images/wavefunction/wavefunction_" +
      mass_str +
      "x" +
      velocity_str +
      ".gif";
    let wave_img2_path =
      "./model_images/wavefunction/wavefunction_probDensity_" +
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
    setOpenSnackbar(true); // open snackbar
  }

  // === return ===
  return (
    <div>
      <Layout style={{ minHeight: "100vh" }}>
        {/* ============== Sider ============== */}
        <Sider
          // collapsible
          // collapsed={collapsed}
          // onCollapse={(value) => setCollapsed(value)}
          style={sidebar_style}
          width={230}
        >
          <div>
            <CustomTitle />

            <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 0.5, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
            style={horizontal_center}
            >
              {/* ====== Sliders ====== */}

              {/* ====== Mass Slider ====== */}
              <Stack spacing={3}>
                {/* selects */}
                <FormControl variant="filled">
                  <InputLabel 
                    id="mass-select"
                    style={{color: "white", marginTop: "10px", marginBottom: "10px", marginLeft: "-8 px", textAlign: "left"}}
                    >  
                    Mass
                    </InputLabel>
                  <Slider
                    sx={{ color: "#FFFFFF" }}
                    aria-label="mass-select"
                    min={1}
                    max={10}
                    defaultValue={1}
                    valueLabelDisplay="auto"
                    step={1}
                  />
                </FormControl>

                {/* ====== Velocity Slider ====== */}
                <FormControl variant="filled">
                  <InputLabel 
                    id="velocity-select"
                    style={{color: "white", marginTop: "10px", marginBottom: "10px", marginLeft: "-8 px", textAlign: "left"}}
                    >  
                    Velocity
                    </InputLabel>
                  <Slider
                    sx={{ color: "#FFFFFF" }}
                    aria-label="velocity-select"
                    min={1}
                    max={10}
                    defaultValue={1}
                    valueLabelDisplay="auto"
                    step={1}
                  />
                </FormControl>

                {/* submit button */}
                <div style ={{ marginTop: "10px", marginBottom: "10px", textAlign: "center"}}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                type="submit"
                color="success"
                sx={{
                  marginTop: "50px", // Adds space above the button
                }}
              >
                Generate Model
              </Button>
            </div>

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
          </div>
        </Sider>

        {/* ============ Right Content ============ */}
        <Layout style={{ margin: "5%" }}>
          <Content>
            <CustomPageHeader text="Wavefunction" size="h3" />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <img
                  src={wavefunction_img1}
                  alt="wave function"
                  style={img_style}
                />
              </Grid>

              <Grid item xs={6}>
                <img
                  src={wavefunction_img2}
                  alt="wave function"
                  style={img_style}
                />
              </Grid>
            </Grid>
            <CustomDescriptionBox
              msg={`
                A wavefunction mathematically describes the wave characteristics of quantum particles, usually electrons.

                In classical mechanics, objects are typically depicted as free bodies with a known kinetic and potential energy relative to their environment, like a ball at the top of a slope. Objects in quantum mechanics, typically subatomic particles like photons and electrons, are also described in a similar way where theirkinetic and potential energies are combined to describe their behavior. This is known as the Hamiltonian operator. This is the core of how we talk about systems in quantum physics. It dictates what is known about the energy of the system and applies it to the wave function of a particle to represent its movement relative to time, much like how knowing the total energy of a ball allows us to understand how it will move down a slope and thereby where it might be at any given time.
                
                Shown is a wave function of a particle where assuming no potential energy in the system, just kinetic energy as dictated by its mass and velocity. Notice as the particle propagates in the x-direction, it causes perturbations in the y and z directions.
                
                The other example shown is the particle’s “probability density”. This is how likely the particle will be at a location at a given time. In classical physics, we can know with certainty where a ball will be with great precision as it travels down a slope. If the probability density of a ball were plotted, it would result in a sharp point traveling smoothly along at 1 or 100%. However, when considering the quantum realm, we lose this certainty. The Heisenberg Uncertainty Principle dictates that the position and momentum in a single direction of a particle can not be simultaneously known. This is due to the fact that particles at such small scale behave more erratically than those on a classical scale. The result in this case is a curved probability density traveling in time as shown.

                Try altering the mass and velocity of the particle. How does this affect its propagation? How does it change the shape of its wave function? How does the probability density change relative to its kinetic energy?
                `}
            />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default Wavefunction;
