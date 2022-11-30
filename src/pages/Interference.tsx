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
          msg={
            "Quantum interference states that elementary particles can not only be in more than one place at any given time (through superposition), but that an individual particle, such as a photon (light particles) can cross its own trajectory and interfere with the direction of its path."
          }
        />
      </Content>
    </Layout>
  );
};

export default Interference;
