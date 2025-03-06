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
import { Socket } from "socket.io-client";
import io from "socket.io-client";
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
interface StatusUpdate {
  message: string;
}

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
  const [snackbarMsg, setSnackbarMessage] = useState("");
  const [severity, setSeverity] = useState<AlertProps['severity']>('success');
  const [openSnackBar, setOpenSnackbar] = useState(false);

    // ========= socket connection =========
    useEffect(() => {
      const socket = io(host);
  
      socket.on('connect', () => {
        console.log('Connected to server');
      });
  
      socket.on('connect_error', (error: any) => {
        console.error('Connection error:', error);
        setSnackbarMessage('Failed to connect to server');
        setSeverity('error');
        setOpenSnackbar(true);
      });
  
      socket.on('status_update', (data: StatusUpdate) => {
        setSnackbarMessage(data.message);
        setSeverity('info');
        setOpenSnackbar(true);
      });
  
      socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });
  
      return () => {
        socket.disconnect();
      };
    }, []);

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
    if (snackbarMsg !== "") {
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
        setSeverity('success');
      }
      else {
        setSnackbarMessage("Failed to generate model.");
        setSeverity('error');
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
    const widthScale = (flexWidth) / 1200;
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
                        <Typography variant="body1" color="black" align="right">
                          Spacing (nm)
                        </Typography>
                      </InputLabel>
                      <Slider
                        sx={{ color: isAdvanced ? "darkred" : "#063970" }}
                        aria-label="spacing"
                        defaultValue={0.5}
                        valueLabelDisplay="auto"
                        step={isAdvanced ? 0.1 : 0.4}
                        min={0.1}
                        max={1}
                        onChange={handleSpacing}
                        />
                    </FormControl>

                    {/* ====== Slit Seperation Slider ====== */}
                    <FormControl variant="filled">
                      <InputLabel id="slitSep-label" style={{color: "black", marginTop: "10px" }}>
                        <Typography variant="body1" color="black" align="right">
                          Slit Seperation (nm)
                        </Typography>
                      </InputLabel>
                      <Slider
                        sx={{ color: isAdvanced ? "darkred" : "#063970" }}
                        aria-label="slitSep"
                        defaultValue={0.5}
                        valueLabelDisplay="auto"
                        step={isAdvanced ? 0.1 : 0.5}
                        min={0.1}
                        max={1}
                        onChange={handleSlitSep}
                        />
                    </FormControl>

                    <FormControl variant="filled">
                      <InputLabel id="wave-label" style={{color: "black", marginTop: "10px" }}>
                        <Typography variant="body1" color="black" align="right">
                          Wave number k (nm)<sup>-1</sup>
                        </Typography>
                      </InputLabel>
                      <Slider
                        sx={{ color: isAdvanced ? "darkred" : "#063970" }}
                        aria-label="wave"
                        defaultValue={1}
                        valueLabelDisplay="auto"
                        step={1}
                        min={1}
                        max={isAdvanced ? 5 : 10}
                        onChange={handleWave}
                        />
                    </FormControl>

                    {/* ====== Submit Button ====== */}
                    {loading ? (
                      <Box display="flex" justifyContent="center">
                        <CircularProgress />
                      </Box>
                    ) : (
                      <Button variant="contained" onClick={handleSubmit} type="submit" color="success" style={{marginTop: "40px"}}>
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