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
  CardContent
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
  const [momentum, setMomentum] = useState<number>(1);
  const [spacing, setSpacing] = useState<number>(0.6);
  const [slit_separation, setSlitSeparation] = useState<number>(0.6);
  const [animationJsHtml, setAnimationJsHtml] = useState('');
  const animationContainerRef = useRef<HTMLDivElement>(null);
  const [spacingSliderMoved, setSpacingSliderMoved] = useState(false);
  const [slitSepSliderMoved, setSlitSepSliderMoved] = useState(false);
  const [waveSliderMoved, setWaveSliderMoved] = useState(false);
  const [success_msg, set_Success_Msg] = useState(
    "Interference model generated with spacing = " + spacing.toString() + ", slitSep = " + slit_separation.toString() + ", and wave = " + momentum.toString() + "!"
  );
  const [open, setOpenSnackbar] = useState(false);

  // ========= handle functions =========
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
        fetch('/interference/probs_1_0.6_0.6_3D.html')
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
  useEffect(() => {
    if (animationJsHtml && animationContainerRef.current) {
      const container = animationContainerRef.current;
      container.innerHTML = animationJsHtml; // Now TypeScript knows container is a div element

      // Ensure TypeScript treats each script as an HTMLScriptElement
      const scripts = Array.from(container.querySelectorAll('script'));
      scripts.forEach((scriptElement) => {
        const script = scriptElement as HTMLScriptElement; // Type assertion
        const newScript = document.createElement('script');
        newScript.text = script.text;
        container.appendChild(newScript);
        script.parentNode?.removeChild(script);
      });
    }
  }, [animationJsHtml]);

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
    console.log("spacing:", spacing_str);
    console.log("slit_separation:", slit_separation_str);
    console.log("wave:", wave_str);

    let base_url = host + "/receive_data/interference";
    let final_url =
    base_url + "/" + spacing_str +
    "/" + slit_separation +
    "/" + wave_str;

    if (spacingSliderMoved || waveSliderMoved || slitSepSliderMoved) {
      setLoading(true);
      const gifData = await getGifFromServer(final_url);
      if (gifData) {
        set_Success_Msg(
          "Interference model generated with barrier = " +
            spacing_str +
            ", thickness = " +
            slit_separation_str +
            ", and wave = " +
            wave_str +
            "!"
        );
        setLoading(false);
        setSpacingSliderMoved(false);
        setSlitSepSliderMoved(false);
        setWaveSliderMoved(false);
      }
    }
    setOpenSnackbar(true); // open snackbar
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content className="site-layout" style={{margin: "5%"}}>
        <CustomPageHeader text="Interference" size="h3"/>
        <CustomDescriptionBox
            title="What is interference?"
            imageUrl="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjzBWFVf3m3-Wh1k4q9mNAxbDcDTS_4qEiZ7SK_dG2iQO9dUP6r4IAq8eXiK0utCTeafofhwb8gvWpt8J8oTziDUq3EnoTYbpvLASi8gnrW3E5k59PnSDh48JGNiY5sjj_l9BjOGiOqgY-d/?imgmax=800"
            msg={`In quantum physics, tiny particles can be in more than one place at once! This idea is called "superposition." Not only that, but sometimes these particles, like light particles (called photons), can actually interfere with themselves, just like two waves crossing each other in water!`}
        />
        <CustomDescriptionBox
            title="Are quantum particles waves?"
            msg={`Particles in quantum physics don't act like everyday objects. These tiny particles, like electrons or photons, act like both **particles** (solid objects) and **waves** (like water waves). This special behavior is called **wave-particle duality**. Scientists use something called the **DeBroglie wavelength** to figure out how wavy a particle is. The smaller the particle's energy, the more like a wave it behaves!`}
        />
        <CustomDescriptionBox
            title="How is wavelength calculated?"
            msg={`Scientists use a formula to find out how wavy a particle is. It looks like this:  
F = p/h  
But what does that mean? It means that if a particle is moving really fast (high momentum), its wavelength becomes super tiny! But for small particles, like electrons or photons, the waves are bigger and easier to see.`}
        />
        <CustomDescriptionBox
            title="The Double Slot Experiment"
            imageUrl="https://quantumawareness.net/wp-content/uploads/2019/01/doubleslottest-1400x793-71-2.jpg"
            msg={`Here’s a cool experiment that shows how photons (light particles) act like both particles and waves. You’d think you’d see two lines on the other side, right? But what you actually see is a pattern of light and dark lines, like waves crossing in water!

This is because the photons aren’t just acting like particles. They’re also behaving like waves that **interfere** with each other, creating this special pattern.`}
        />
        <CustomDescriptionBox
            title="Try it out!"
            msg={`Change the distance between the slits, or change how much energy the wave has.  
- What happens to the pattern on the wall?
- Does the wave’s energy change the spacing of the light and dark lines?

Try it out and see how waves and particles are both part of the same strange quantum world!`}
        />
      <Card
      style={{
        borderRadius: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: "5%",
      }}
    >
      <CardContent style={{ flex: 1, maxWidth: "300px" }}>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 0.5, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
          display="flex"
          flexDirection="column"
        >
          <Stack spacing={5}>
          <CustomTitle/>
            <FormControl fullWidth>
              <InputLabel id="spacing-label" style={{ marginTop: "5%" }}>Spacing</InputLabel>
              <Slider
                aria-label="spacing"
                defaultValue={0.6}
                valueLabelDisplay="auto"
                step={0.1}
                min={0.1}
                max={1}
                onChange={handleSpacing}
                sx={{ color: "#063970" }}
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="slitSep-label" style={{ marginTop: "5%" }}>Slit Separation</InputLabel>
              <Slider
                aria-label="slitSep"
                defaultValue={0.6}
                valueLabelDisplay="auto"
                step={0.1}
                min={0.1}
                max={1}
                onChange={handleSlitSep}
                sx={{ color: "#063970" }}
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="wave-label" style={{ marginTop: "5%" }}>Wave</InputLabel>
              <Slider
                aria-label="wave"
                defaultValue={1}
                valueLabelDisplay="auto"
                step={1}
                min={1}
                max={5}
                onChange={handleWave}
                sx={{ color: "#063970" }}
              />
            </FormControl>
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
      </CardContent>

      <CardContent
        style={{
          flex: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div ref={animationContainerRef} style={{ width: "100%", height: "100%" }}></div>
      </CardContent>
    </Card>
      </Content>
    </Layout>
  );
};

export default Interference;