import { useState, useEffect, useRef } from "react";
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
  Slider,
  Card,
  CardContent,
  Typography,
  Checkbox,
  FormControlLabel,
  AlertProps
} from "@mui/material";
import CircularProgress from '@mui/joy/CircularProgress';
import { Layout } from "antd";
import "antd/dist/antd.min.css";
import host from "../setup/host";

// === Custom Components ===
import {
  Dashboard,
  CustomTitle,
  CustomPageHeader,
  CustomDescriptionBox,
} from "../components";

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
  const [loading, setLoading] = useState(false);
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [momentum, setMomentum] = useState<number>(1);
  const [spacing, setSpacing] = useState<number>(0.6);
  const [slit_separation, setSlitSeparation] = useState<number>(0.6);
  const [animationJsHtml, setAnimationJsHtml] = useState('');
  const animationDivRef = useRef<HTMLDivElement>(null);
  const animationFlexRef = useRef<HTMLDivElement>(null);
  const [spacingSliderMoved, setSpacingSliderMoved] = useState(false);
  const [slitSepSliderMoved, setSlitSepSliderMoved] = useState(false);
  const [waveSliderMoved, setWaveSliderMoved] = useState(false);
  const [snackbarMsg, setSnackbarMessage] = useState("Default interference model generated!");
  const [severity, setSeverity] = useState<AlertProps['severity']>('success');
  const [openSnackBar, setOpenSnackbar] = useState(false);

  // ========= handle functions =========
  async function getGifFromServer(request_url: string) {
    try {
      const response = await fetch(request_url, {method: 'GET'});
      if (!response.ok) {
        console.error("Error fetching animation from server");
        setSeverity('error');
        return null;
      }
      const responseData = await response.text();
      setAnimationJsHtml(responseData); // Adjust based on your API response structure
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
        fetch('/interference/probs_1_0.6_0.6_3D.html')
        .then((response) => response.text())
        .then((text) => {
          setAnimationJsHtml(text);
        console.log(text)
        });
      } catch (error) {
        console.error('Failed to load default HTML content:', error);
        setSeverity('error');
      }
    };

    loadDefaultHtml();
  }, []);

  useEffect(() => {
    if (animationJsHtml && animationDivRef.current) {
      const container = animationDivRef.current;
      container.innerHTML = animationJsHtml; // Now TypeScript knows container is a div element

      // Ensure TypeScript treats each script as an HTMLScriptElement
      const scripts = Array.from(container.querySelectorAll("script"));
      scripts.forEach((scriptElement) => {
        const script = scriptElement as HTMLScriptElement; // Type assertion
        const newScript = document.createElement('script');
        newScript.text = script.text;
        container.appendChild(newScript);
        script.parentNode?.removeChild(script);
      });
    }
  }, [animationJsHtml]);

  useEffect(() => {
    if (snackbarMsg) {
      setOpenSnackbar(true);
    }
  }, [snackbarMsg]);

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

  const handleSpacing = (event: Event, spacingValue: number | number[]) => {
    setSpacing(spacingValue as number);
    setSpacingSliderMoved(true);
  };

  const handleSlitSep = (event: Event, slitSepValue: number | number[]) => {
    setSlitSeparation(slitSepValue as number);
    setSlitSepSliderMoved(true);
  };

  const handleWave = (event: Event, waveValue: number | number[]) => {
    setMomentum(waveValue as number);
    setWaveSliderMoved(true);
  };

  async function handleSubmit(event: any) {
    event.preventDefault();
    let spacing_str = spacing.toString();
    let slit_separation_str = slit_separation.toString();
    let wave_str = momentum.toString();
    
    if (spacing_str === "") {
      spacing_str = "0.1";
    }
    if (slit_separation_str === "") {
      slit_separation_str = "0.1";
    }
    if (wave_str === "") {
      wave_str = "1";
    }

    let base_url = host + "/receive_data/interference";
    let final_url =
    base_url + "/" + spacing_str +
    "/" + slit_separation +
    "/" + wave_str;

    if (spacingSliderMoved || waveSliderMoved || slitSepSliderMoved) {
      setLoading(true);
      const gifData = await getGifFromServer(final_url);
      if (gifData) {
        setSnackbarMessage(
          "Interference model generated with barrier = " +
            spacing_str +
            ", thickness = " +
            slit_separation_str +
            ", and wave = " +
            wave_str +
            "!"
        );
        
      }
      else {
        setSnackbarMessage("Failed to generate model.");
      }
      setLoading(false);
      setSpacingSliderMoved(false);
      setSlitSepSliderMoved(false);
      setWaveSliderMoved(false);
    }
    setOpenSnackbar(true); // open snackbar
  }

  let [scale, setState] = useState(1);
  const handleResize = () => {    
    if (!animationFlexRef.current || !animationDivRef.current) return;

    const flexWidth = animationFlexRef.current.offsetWidth || 600;
    const flexHeight = animationFlexRef.current.offsetHeight || 600; // Get available height
    const divWidth = animationDivRef.current.offsetWidth || 600;
    const divHeight = animationDivRef.current.offsetHeight || 400; 

    // Calculate scale based on both width and height constraints
    const widthScale = (flexWidth - 300) / 1200;
    const heightScale = flexHeight / 700; // Assuming 700 is the original height of animation

    const newScale = Math.min(widthScale, heightScale); // Ensure it doesn't exceed the box height

    setState(newScale); // Update scale

  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize(); // Call initially to set the scale

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

return (
    <Layout 
      style={{ 
        minHeight: "100vh", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center" 
      }}
    >

      <Content 
        className="site-layout" 
        style={{
          margin: "5%", 
          maxWidth: "70%", 
          minWidth: "1000px",
          }}
        >

          {/* Title for the page */}
          <CustomPageHeader text="Interference" size="h3"/> 

          {/* Content for the page imported from data.json */}
          <CustomDescriptionBox pageTitle="Interference"/>

            <Card
              style={{
                borderRadius: "10px",
                display: "flex",
                flexDirection: "row",
                width: "100%",
              }}
              ref={animationFlexRef}
            >
              {/* Left Box */}
              <Box
                component="form"
                sx={{
                  "& > :not(style)": { m: 0.5, width: "25ch" },
                  padding: "10px",
                  width: "300px",
                  minWidth: "300px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
                noValidate
                autoComplete="off"
                style={horizontal_center}
              >
                <Box
                  component="form"
                  sx={{
                    "& > :not(style)": { m: 0.5, width: "25ch" },
                    padding: "20px",
                    width: "200px",
                    minWidth: "200px",
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <Stack spacing={3}>
                  <CustomTitle pageName="Interference"/>
                    
                    {/* ====== Spacing Slider ====== */}
                    <FormControl variant="filled">
                      <InputLabel id="spacing-label" style={{color: "black", marginTop: "10px" }}>
                        Spacing
                      </InputLabel>
                      <Slider
                        aria-label="spacing"
                        defaultValue={0.6}
                        valueLabelDisplay="auto"
                        step={0.1}
                        min={0.1}
                        max={1}
                        onChange={handleSpacing}
                        sx={{ color: "#063970" }}/>
                      {/* <Typography variant="body2" color="black" align="right">
                        (eV)
                      </Typography> */}
                    </FormControl>

                    {/* ====== Slit Seperation Slider ====== */}
                    <FormControl variant="filled">
                      <InputLabel id="slitSep-label" style={{color: "black", marginTop: "10px" }}>
                        Slit Separation
                      </InputLabel>
                      <Slider
                        aria-label="slitSep"
                        defaultValue={0.6}
                        valueLabelDisplay="auto"
                        step={0.1}
                        min={0.1}
                        max={1}
                        onChange={handleSlitSep}
                        sx={{ color: "#063970" }}/>
                      {/* <Typography variant="body2" color="black" align="right">
                        (nm)
                      </Typography> */}
                    </FormControl>

                    <FormControl variant="filled">
                      <InputLabel id="wave-label" style={{color: "black", marginTop: "10px" }}>
                        Wave
                      </InputLabel>
                      <Slider
                        aria-label="wave"
                        defaultValue={1}
                        valueLabelDisplay="auto"
                        step={1}
                        min={1}
                        max={5}
                        onChange={handleWave}
                        sx={{ color: "#063970" }}/>
                      {/* <Typography variant="body2" color="black" align="right">
                        (nm)<sup>-1</sup>
                      </Typography> */}
                    </FormControl>

                    {/* ====== Submit Button ====== */}
                    {loading ? (
                      <Box display="flex" justifyContent="center">
                        <CircularProgress />
                      </Box>
                    ) : (
                      <Button variant="contained" onClick={handleSubmit} type="submit" color="success">
                        Generate Model
                      </Button>
                    )}
                    {/* Toggle Switch */}
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isAdvanced}
                          onChange={() => setIsAdvanced((prev) => !prev)}
                        />
                      }
                      label={"Advanced Mode"}
                      style={{ alignSelf: "center", color: "black" }}
                    />
                  </Stack>
                </Box>
              </Box>

              {/* Right Box */}
              <div
                style={{
                  overflow: "clip",
                  width: animationFlexRef.current ? animationFlexRef.current.offsetWidth - 300 : 600,
                }}
              >
                <style>
                  {`
                    .animation {
                      transform-origin: center center;
                      scale: ${scale};  
                    }
                  `}
                </style>
                <div
                  style={{
                    backgroundColor: "white",
                    width: animationFlexRef.current ? animationFlexRef.current.offsetWidth - 300 : 600,
                  
                  }}
                  ref={animationDivRef}
                />
              </div>
            </Card>
            <Snackbar
              open={openSnackBar}
              autoHideDuration={6000}
              onClose={() => setOpenSnackbar(false)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <Alert onClose={() => setOpenSnackbar(false)} severity={severity}>
                {snackbarMsg}
              </Alert>
            </Snackbar>
        </Content>
    </Layout>
  );
};

export default Interference;