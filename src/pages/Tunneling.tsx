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
import CircularProgress from '@mui/joy/CircularProgress';
import { Layout } from "antd";
import "antd/dist/antd.min.css";
import axios from "axios";

// === Custom Components ===
import {
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
  const [loading, setLoading] = useState(false);
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

  async function getGifFromServer(request_url: string) {
    try {
      const response = await axios.get(request_url);
      const base64Gif2D = response.data['2D'];
      const base64Gif3D = response.data['3D'];
      return { base64Gif2D, base64Gif3D };
    } catch (error) {
      console.error("Error fetching gif from server:", error);
    }
  }

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
  async function handleSubmit(event: any) {
    setLoading(true);
    event.preventDefault();
    let barrier_str = barrier.toString();
    let thickness_str = thickness.toString();
    let wave_str = wave.toString();
    console.log("barrier:", barrier_str);
    console.log("thickness:", thickness_str);
    console.log("wave:", wave_str);
    let base_url = "http://44.227.0.52:59059/v1/hello?"

    // if no input, set to default
    if (barrier_str === "") {
      barrier_str = "1";
    }
    if (thickness_str === "") {
      thickness_str = "1";
    }
    if (wave_str === "") {
      wave_str = "1";
    }

    let final_url =
      base_url + "intensity=" + barrier_str +
      "&thickness=" + thickness_str +
      "&momentum=" + wave_str;
    
    const gifData = await getGifFromServer(final_url);
    if (gifData) {
      const { base64Gif2D, base64Gif3D } = gifData;
      if (base64Gif2D) {
        set_Tunneling_img2d(`${base64Gif2D}`);
      }
      if (base64Gif3D) {
        set_Tunneling_img3d(`${base64Gif3D}`);
      }
      set_Success_Msg(
        "Tunneling model generated with barrier = " +
          barrier_str +
          ", thickness = " +
          thickness_str +
          ", and wave = " +
          wave_str +
          "!"
      );
      setLoading(false);
    }
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
              {loading ? (
                <CircularProgress />
              ) : (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  type="submit"
                  color="success"
                >
                  Generate Model
                </Button>
              )}
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
        <Layout style={{ margin: "5%" }}>
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
                "Quantum tunneling, also known as tunneling is a quantum mechanical phenomenon whereby a wavefunction can propagate through a potential barrier. The transmission through the barrier can be finite and depends exponentially on the barrier height and barrier width.The non-unitary probability density (previously described in wave functions) of elementary particles causes some expected behaviors observed in classical physics to not fully translate into quantum physics. Elementary particles behave with a degree of unpredictability, with their position being partially decoupled from their “expected” position relative to their probability density and thereby their wave function. As a result, such particles can “tunnel” through potential energy barriers. Imagine throwing a tennis ball at a wall. In classical physics, the tennis ball will bounce off the wall every time. In quantum physics, sometimes your tennis ball will slip part way through the wall before bouncing back and, if the wall is thin and weak enough, it will travel through the wall at a reduced momentum. The ball will also frequently reflect off the wall as expected with the probability of tunneling through the wall being increased if the barrier is physically thinner and if it is weaker, in quantum physics a weaker barrier would have a lower magnitude of potential energy. A particle, or ball, traveling with higher kinetic energy also tends to tunnel more often. Try changing the width and intensity of the barrier as well as the energy of the particle. Does the particle always tunnel? What shape does the probability density function take once it meets the wall? How does it relate to the shape of the probability function as it is propagating?"
              }
            />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default Tunneling;
