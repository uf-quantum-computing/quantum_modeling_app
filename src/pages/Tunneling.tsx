import { useState, useEffect, useRef, SetStateAction } from "react";
// === UI Components ===
import {
  Box,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  InputLabel,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import { Layout } from "antd";
import "antd/dist/antd.min.css";
import host from "../setup/host";

// === Custom Components ===
import {
  CustomDescriptionBox,
  CustomPageHeader,
  CustomTitle,
} from "../components";

// === sub component imports ===
const { Content } = Layout;

const horizontal_center = {
  display: "flex",
  // alignItems: "center",  # vertical center
  justifyContent: "center",
};

const Tunneling = () => {
  const [loading, setLoading] = useState(false);
  const [isAdvanced, setIsAdvanced] = useState(false);
  // ========= states =========
  const [barrier, setBarrier] = useState<number>(1);
  const [thickness, setThickness] = useState<number>(1.0);
  const [wave, setWave] = useState<number>(1);
  const [animationJsHtml, setAnimationJsHtml] = useState<string>("");
  const animationDivRef = useRef<HTMLDivElement>(null);
  const animationFlexRef = useRef<HTMLDivElement>(null);
  const [barrierSliderMoved, setBarrierSliderMoved] = useState(false);
  const [thicknessSliderMoved, setThicknessSliderMoved] = useState(false);
  const [waveSliderMoved, setWaveSliderMoved] = useState(false);
  const [success_msg, set_Success_Msg] = useState(
    "Tunneling model generated with barrier = " +
      barrier.toString() +
      ", thickness = " +
      thickness.toString() +
      ", and wave = " +
      wave.toString() +
      "!"
  );
  const [open, setOpenSnackbar] = useState(false);

  async function getGifFromServer(request_url: string) {
    try {
      const response = await fetch(request_url, { method: "GET" });
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
        console.log("triggered");
        fetch("/tunneling/probs_1.0_1.0_1.0_3D.html")
          .then((response) => response.text())
          .then((text) => {
            setAnimationJsHtml(text);
            console.log(text);
          });
      } catch (error) {
        console.error("Failed to load default HTML content:", error);
      }
    };

    loadDefaultHtml();
  }, []);

  // Your existing useEffect for handling animationJsHtml changes
  useEffect(() => {
    if (animationJsHtml && animationDivRef.current) {
      const container = animationDivRef.current;
      container.innerHTML = animationJsHtml;

      const scripts = Array.from(container.querySelectorAll("script"));
      scripts.forEach((scriptElement) => {
        const script = scriptElement as HTMLScriptElement;
        const newScript = document.createElement("script");
        newScript.text = script.text;
        container.appendChild(newScript);
        script.parentNode?.removeChild(script);
      });
    }
  }, [animationJsHtml]);

  // ========= handle functions =========
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

    let base_url = host + "/receive_data/tunneling";
    let final_url =
      base_url + "/" + barrier_str + "/" + thickness_str + "/" + wave_str;

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

  let [scale, setState] = useState(1);
  const handleResize = () => {    
    if (!animationFlexRef.current || !animationDivRef.current) return;

    const flexWidth = animationFlexRef.current.offsetWidth || 600;
    const flexHeight = animationFlexRef.current.offsetHeight || 400; // Get available height
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

  // ========= return =========
  return (
    <Layout
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
        <CustomPageHeader text="Tunneling" size="h3" />

        {/* Content for the page imported from data.json */}
        <CustomDescriptionBox pageTitle="Tunneling" />

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
              <CustomTitle />

                {/* ====== Barrier Slider ====== */}
                <FormControl variant="filled">
                  <InputLabel id="barrier-select" style={{ color: "black", marginBottom: "10px" }}>
                    Barrier
                  </InputLabel>
                  <Slider
                    sx={{ color: "#063970" }}
                    aria-label="barrier-select"
                    value={barrier}
                    onChange={handleBarrier}
                    min={1}
                    max={isAdvanced ? 5 : 3} // Beginner: 1-3, Advanced: 1-5
                    step={1}
                    valueLabelDisplay="auto"
                  />
                  <Typography variant="body2" color="black" align="right">
                    (eV)
                  </Typography>
                </FormControl>

                {/* ====== Thickness Slider ====== */}
                <FormControl variant="filled">
                  <InputLabel id="thickness-select" style={{ color: "black", marginBottom: "10px" }}>
                    Thickness
                  </InputLabel>
                  <Slider
                    sx={{ color: "#063970" }}
                    aria-label="thickness-select"
                    value={thickness}
                    onChange={handleThickness}
                    min={1}
                    max={isAdvanced ? 20 : 10} // Beginner: 1-10, Advanced: 1-20
                    step={isAdvanced ? 0.5 : 1} // Beginner step: 1, Advanced step: 0.5
                    valueLabelDisplay="auto"
                  />
                  <Typography variant="body2" color="black" align="right">
                    (nm)
                  </Typography>
                </FormControl>

                {/* ====== Wave Number k Slider ====== */}
                <FormControl variant="filled">
                  <InputLabel id="wave-select" style={{ color: "black", marginBottom: "10px" }}>
                    Wave number k
                  </InputLabel>
                  <Slider
                    sx={{ color: "#063970" }}
                    aria-label="wave-select"
                    value={wave}
                    onChange={handleWave}
                    min={1}
                    max={isAdvanced ? 15 : 10} // Beginner: 1-10, Advanced: 1-15
                    step={1}
                    valueLabelDisplay="auto"
                  />
                  <Typography variant="body2" color="black" align="right">
                    (nm)<sup>-1</sup>
                  </Typography>
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
                  transform-origin: center left;
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
      </Content>
    </Layout>
  );
};

export default Tunneling;
