import { useState, useEffect, useRef } from "react";
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
import host from "../setup/host";

// === Custom Components ===
import {
  CustomDescriptionBox,
  CustomPageHeader,
  CustomTitle,
  Dashboard,
} from "../components";

// === sub component imports ===
const { Sider, Content } = Layout;

const horizontal_center = {
  display: "flex",
  // alignItems: "center",  # vertical center
  justifyContent: "center",
};

const Tunneling = () => {
  const [loading, setLoading] = useState(false);
  // ========= states =========
  const [barrier, setBarrier] = useState<number>(1);
  const [thickness, setThickness] = useState<number>(1.0);
  const [wave, setWave] = useState<number>(1);
  // const [tunneling_img2d_base64, set_Tunneling_img2d_base64] = useState(base64Text2d);
  // const [tunneling_img3d_base64, set_Tunneling_img3d_base64] = useState(base64Text3d);
  const [animationJsHtml, setAnimationJsHtml] = useState('');
  const animationContainerRef = useRef<HTMLDivElement>(null);
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
      // console.log("responseData: ", responseData);
      setAnimationJsHtml(responseData.GifRes); // Adjust based on your API response structure
      return response.ok;
    } catch (error) {
      console.error("Error fetching animation from server:", error);
      throw error;
    }
  }

  useEffect(() => {
    const loadDefaultHtml = async () => {
      try {
        console.log("triggered")
        fetch('/tunneling/probs_1.0_1.0_1.0_3D.html')
        .then((response) => response.text())
        .then((text) => {
          setAnimationJsHtml(text);
        console.log(text)
        });
      } catch (error) {
        console.error('Failed to load default HTML content:', error);
      }
    };

    loadDefaultHtml();
  }, []);

  // Your existing useEffect for handling animationJsHtml changes
  useEffect(() => {
    if (animationJsHtml && animationContainerRef.current) {
      const container = animationContainerRef.current;
      container.innerHTML = animationJsHtml;

      const scripts = Array.from(container.querySelectorAll('script'));
      scripts.forEach((scriptElement) => {
        const script = scriptElement as HTMLScriptElement;
        const newScript = document.createElement('script');
        newScript.text = script.text;
        container.appendChild(newScript);
        script.parentNode?.removeChild(script);
      });
    }
  }, [animationJsHtml]);

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

    let base_url = host + "/receive_data/tunneling"
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
          style={{ padding: "1%", position: "fixed", height: "100%", }}
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
                  defaultValue={1.0}
                  valueLabelDisplay="auto"
                  step={0.1}
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

        <Layout style={{ paddingLeft: 230, margin: '5%' }}>
          <Content>
            <CustomPageHeader text="Tunneling" size="h3"/>
            {/*<iframe src="../../quantum_app_backend/cache/tunneling/probs_1.0_2.0_1.0_3D.html" style={{display: 'flex', justifyContent: 'center'}}/>*/}
            <CustomDescriptionBox 
              title="What is tunneling?"
              imageUrl="https://www.wikihow.com/images/thumb/3/32/Play-Wall-Ball-Step-9-Version-2.jpg/v4-460px-Play-Wall-Ball-Step-9-Version-2.jpg.webp"
              msg="Imagine you're hitting a ball at a wall. Normally, the ball would just bounce back, right? But in quantum physics, sometimes the ball can go through the wall, even if the wall is solid! This is a concept called tunneling."
            />
            <CustomDescriptionBox 
              title="Why do particles act so strange?"
              msg="Particles, like tiny pieces of matter, don't always act the way we expect them to. In regular physics, like with balls or cars, we can predict where things will go. But in quantum physics, these tiny particles are super unpredictable! Their position is a bit fuzzy, and sometimes they show up where you'd never expect them to. This is why they can tunnel through barriers."
            />
            <CustomDescriptionBox 
              title="What affects whether the ball goes through the wall?"
              msg="There are a few things that make tunneling easier for particles:
- If the wall (or barrier) is thinner.
- If the wall is weaker (lower energy).
- If the particle is moving faster (has more energy).
When these things happen, the particle (or tennis ball) is more likely to go through the wall!"
            />
            <CustomDescriptionBox 
              title="Try it out!"
              msg="Change the thickness and strength of the barrier, and adjust the energy of the particle. Does the particle always tunnel through? What does the pattern of the particle's behavior look like when it reaches the barrier? How does it change as the particle moves? See what happens!"
            />
          </Content>
          <div style={{display: 'flex', justifyContent: 'center'}} ref={animationContainerRef}></div>
        </Layout>
      </Layout>
    </div>
  );
};

export default Tunneling;