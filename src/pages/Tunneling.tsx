import { useState } from "react";
// === UI Components ===
import {
  Grid,
  Box,
  Button,
  Stack,
  // SelectChangeEvent,
  Alert,
  Snackbar,
  InputLabel,
  FormControl,
  Slider,
  Typography
} from "@mui/material";
import CircularProgress from '@mui/joy/CircularProgress';
import { Layout } from "antd";
import "antd/dist/antd.min.css";
// import axios from "axios";
import base64Text3d from "../base64txt/default3d";
import base64Text2d from "../base64txt/default2d";


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
// const select_style = { backgroundColor: "#FFFFFF" };
// const img_style = {
//   borderRadius: "10px",
//   boxShadow: "0 0 5px -1px rgba(0,0,0,0.2)",
//   width: "100%",
// };
const horizontal_center = {
  display: "flex",
  // alignItems: "center",  # vertical center
  justifyContent: "center",
};

const Tunneling = () => {
  const [loading, setLoading] = useState(false);
  // ========= states =========
  const [barrier, setBarrier] = useState<number>(1);
  const [thickness, setThickness] = useState<number>(1);
  const [wave, setWave] = useState<number>(1);
  const [tunneling_img2d_base64, set_Tunneling_img2d_base64] = useState(base64Text2d);
  const [tunneling_img3d_base64, set_Tunneling_img3d_base64] = useState(base64Text3d);
  const [barrierSliderMoved, setBarrierSliderMoved] = useState(false);
  const [thicknessSliderMoved, setThicknessSliderMoved] = useState(false);
  const [waveSliderMoved, setWaveSliderMoved] = useState(false);
  const [success_msg, set_Success_Msg] = useState(
    "Tunneling model generated with barrier = " + barrier.toString() + ", thickness = " + thickness.toString() + ", and wave = " + wave.toString() + "!"
  );
  const [open, setOpenSnackbar] = useState(false);

  async function getGifFromServer(request_url: string) {
    try {
      const response = await fetch(request_url, {method: 'GET'});
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      console.log("responseData: ", responseData);
  
      set_Tunneling_img2d_base64(responseData.base64Gif2D);
      set_Tunneling_img3d_base64(responseData.base64Gif3D);
      return response.ok;
    } catch (error) {
      console.error("Error fetching gif from server:", error);
      throw error; // Re-throw the error for handling in the calling function
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
  const handleBarrier = (event: Event, barrierValue: number | number[]) => {
    setBarrier(barrierValue as number);
    setBarrierSliderMoved(true);
  };
  
  const handleThickness = (event: Event, thicknessValue: number | number[]) => {
    setThickness(thicknessValue as number);
    setThicknessSliderMoved(true);
  };
  
  const handleWave = (event: Event, waveValue: number | number[]) => {
    setWave(waveValue as number);
    setWaveSliderMoved(true);
  };
  
  async function handleSubmit(event: any) {
    event.preventDefault();
    let barrier_str = barrier.toString();
    let thickness_str = thickness.toString();
    let wave_str = wave.toString();
    console.log("barrier:", barrier_str);
    console.log("thickness:", thickness_str);
    console.log("wave:", wave_str);
    
    let base_url = "https://us-central1-quantum-model-generator.cloudfunctions.net/tunneling"
    let final_url =
    base_url + "/" + barrier_str +
    "/" + thickness_str +
    "/" + wave_str;
    
    if (barrierSliderMoved || waveSliderMoved || thicknessSliderMoved) {
      setLoading(true);
      const gifData = await getGifFromServer(final_url);
      if (gifData) {
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
        setBarrierSliderMoved(false);
        setThicknessSliderMoved(false);
        setWaveSliderMoved(false);
      }
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
          width={230}
        >
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
            <Stack spacing={3}>
              <FormControl variant="filled">
                <InputLabel 
                  id="barrier-select"
                  style={{color: "white", marginTop: "10px", marginBottom: "10px", marginLeft: "-8 px", textAlign: "left"}}
                  >
                  Barrier
                  </InputLabel>
                <Slider
                  sx={{ color: "#FFFFFF" }}
                  aria-label="barrier-select"
                  value={barrier}
                  onChange={handleBarrier}
                  min={1}
                  max={3}
                  defaultValue={1}
                  valueLabelDisplay="auto"
                  step={1}
                />
                <Typography variant="body2" color="white" align="right" style={{ alignSelf: 'flex-end', marginRight: '0px', marginTop: '-2px' }}>
          (eV)
                </Typography>
              </FormControl>

              {/* ====== Thickness Slider ====== */}
              <FormControl variant="filled">
                <InputLabel 
                  id="thickness-select"
                  style={{color: "white", marginTop: "10px", marginBottom: "10px", marginLeft: "-8 px", textAlign: "left"}}
                  >
                  Thickness
                  </InputLabel>
                <Slider
                  sx={{ color: "#FFFFFF" }}
                  aria-label="spacing-select"
                  value = {thickness}
                  onChange={handleThickness}
                  min={1}
                  max={10}
                  defaultValue={1}
                  valueLabelDisplay="auto"
                  step={1}
                />
                <Typography variant="body2" color="white" align="right" style={{ alignSelf: 'flex-end', marginRight: '0px', marginTop: '-2px' }}>
                  (nm)
                </Typography>
              </FormControl>

              {/* ====== Wave Select ====== */}
              <FormControl variant="filled">
                <InputLabel 
                  id="wave-select"
                  style={{color: "white", marginTop: "10px", marginBottom: "10px", marginLeft: "-8 px", textAlign: "left"}}
                  >  
                  Wave number k
                  </InputLabel>
                <Slider
                  sx={{ color: "#FFFFFF" }}
                  aria-label="spacing-select"
                  value={wave}
                  onChange={handleWave}
                  min={1}
                  max={10}
                  defaultValue={1}
                  valueLabelDisplay="auto"
                  step={1}
                />
                <Typography variant="body2" color="white" align="right" style={{ alignSelf: 'flex-end', marginRight: '0px', marginTop: '-2px' }}>
                  (nm)
                  <sup>-1</sup>
                </Typography>
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
        {/* <Layout style={{ margin: "5%" }}>
          <Content>
          <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <CustomPageHeader text="Tunneling" size="h3" />
            <CustomDescriptionBox
              msg={tunneling_txt}
            />
            </Grid>
            <Grid item xs={12} sm={6}>
              <img src={`data:image/video;base64,${tunneling_img3d_base64}`} alt="3D Image" style={{ width: "100%" }} />
              <img src={`data:image/video;base64,${tunneling_img2d_base64}`} alt="2D Image" style={{ width: "100%" }} />
            </Grid>
          </Grid>

          </Content>
        </Layout> */}
        {/* ======================== Content ======================== */}
        <Layout style={{ margin: "5%" }}>
          <Content>
            <CustomPageHeader text="Tunneling" size="h3" />
            <Grid container spacing={2}>
              <Grid item xs={6}>
              <img src={`data:image/video;base64,${tunneling_img3d_base64}`} alt="3D tunneling model showcasing a glowing ball hitting a barrier" style={{ width: "100%" }} />
              <Typography variant="body1" align="center" style={{marginTop: '5px'}}>3D Tunneling Model</Typography>
              </Grid>
              <Grid item xs={6}>
              <img src={`data:image/video;base64,${tunneling_img2d_base64}`} alt="2D tunneling model showcasing a wave hitting a barrier" style={{ width: "100%" }} />
              <Typography variant="body1" align="center" style={{marginTop: '5px'}}>2D Tunneling Model</Typography>
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