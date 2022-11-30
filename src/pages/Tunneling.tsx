import { useState } from "react";
import { Link, useNavigate  } from "react-router-dom";
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

// === Custom Global Styles ===
import { sidebar_style } from "../global_styles";

// === Custom Components ===
import {
  VerticalMenu,
  CustomDescriptionBox,
  CustomPageHeader,
  CustomTitle,
  Dashboard,
} from "../components";

// === sub component imports ===
const { Sider, Content } = Layout;

// ======== local styles ========
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

const Tunneling = () => {

  let navigate = useNavigate();

  // ========= states =========
  const [barrier, setBarrier] = useState("");
  const [thickness, setThickness] = useState("");
  const [wave, setWave] = useState("");
  const [tunneling_img2, set_Tunneling_img2d] = useState(
    "./model_images/tunneling/tunneling_2D_1x1x1.gif"
  );
  const [tunneling_img3, set_Tunneling_img3d] = useState(
    "./model_images/tunneling/tunneling_3D_1x1x1.gif"
  );
  const [success_msg, set_Success_Msg] = useState(
    "Tunneling model generated with barrier = 1, thickness = 1, and wave = 1!"
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
      "./model_images/tunneling/tunneling_2D_" +
      barrier_str +
      "x" +
      thickness_str +
      "x" +
      wave_str +
      ".gif";
    let img_path_3D =
      "./model_images/tunneling/tunneling_3D_" +
      barrier_str +
      "x" +
      thickness_str +
      "x" +
      wave_str +
      ".gif";
    set_Tunneling_img2d(img_path_2D);
    set_Tunneling_img3d(img_path_3D);
    set_Success_Msg(
      "Tunneling model generated with barrier = " +
        barrier_str +
        ", thickness = " +
        thickness_str +
        ", and wave = " +
        wave_str +
        "!"
    );
    setOpenSnackbar(true); // open snackbar
  }

  // ========= return =========
  return (
    <div>
      <Layout style={{ minHeight: "100vh" }}>
        {/* ======================== Sider ======================== */}
        <Sider
          // collapsible
          // collapsed={collapsed}
          // onCollapse={(value) => setCollapsed(value)}
          style={{ padding: "1%" }}
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
              <Button
                variant="contained"
                onClick={handleSubmit}
                type="submit"
                color="success"
              >
                Generate Model
              </Button>
            </Stack>
          </Box>

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
        </Sider>

        {/* ======================== Content ======================== */}
        <Layout style={sidebar_style}>
          <Content>
            <CustomPageHeader text="Tunneling" size="h3" />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <img
                  src={tunneling_img3}
                  alt="3D tunneling function"
                  style={img_style}
                />
              </Grid>

              <Grid item xs={6}>
                <img
                  src={tunneling_img2}
                  alt="2D tunneling"
                  style={img_style}
                />
              </Grid>
            </Grid>

            <CustomDescriptionBox
              msg={
                "Quantum tunneling, also known as tunneling is a quantum mechanical phenomenon whereby a wavefunction can propagate through a potential barrier. The transmission through the barrier can be finite and depends exponentially on the barrier height and barrier width."
              }
            />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default Tunneling;
