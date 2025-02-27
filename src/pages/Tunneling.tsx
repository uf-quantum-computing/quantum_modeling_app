import { useState, useEffect, useRef, SetStateAction } from "react";
// === UI Components ===
import {
  Box,
  Card,
  AlertProps,
  Snackbar,
  Alert,
} from "@mui/material";
import { Layout } from "antd";
import "antd/dist/antd.min.css";
import host from "../setup/host";

// === Custom Components ===
import {
  CustomDescriptionBox,
  CustomPageHeader,
} from "../components";
import CustomInputSection from "../components/CustomInputSection";

// === sub component imports ===
const { Content } = Layout;

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
  const [animationJsHtml, setAnimationJsHtml] = useState<string>("");
  const animationDivRef = useRef<HTMLDivElement>(null);
  // const animationContainerRef = useRef<HTMLDivElement>(null);
  const animationFlexRef = useRef<HTMLDivElement>(null);
  const [barrierSliderMoved, setBarrierSliderMoved] = useState(false);
  const [thicknessSliderMoved, setThicknessSliderMoved] = useState(false);
  const [waveSliderMoved, setWaveSliderMoved] = useState(false);
  const [snackbar_msg, setSnackbarMessage] = useState("Default tunneling model generated!");
  const [severity, setSeverity] = useState<AlertProps['severity']>('success');
  const [openSnackBar, setOpenSnackbar] = useState(false);

  async function getGifFromServer(request_url: string) {
    try {
      const response = await fetch(request_url, { method: "GET" });
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
        console.log("triggered");
        fetch("/tunneling/probs_1.0_1.0_1.0_3D.html")
          .then((response) => response.text())
          .then((text) => {
            setAnimationJsHtml(text);
            console.log(text);
          });
      } catch (error) {
        setSnackbarMessage("Failed to load default model.");
        setSeverity('error');
      }
    };

    loadDefaultHtml();
  }, []);

  // Existing useEffect for handling animationJsHtml changes
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

  useEffect(() => {
    if (snackbar_msg) {
      setOpenSnackbar(true);
    }
  }, [snackbar_msg]);

  // ========= handle functions =========
  // const handleBarrier = (event: Event, barrierValue: number | number[]) => {
  //   setBarrier(barrierValue as number);
  //   setBarrierSliderMoved(true);
  // };

  // const handleThickness = (event: Event, thicknessValue: number | number[]) => {
  //   setThickness(thicknessValue as number);
  //   setThicknessSliderMoved(true);
  // };

  // const handleWave = (event: Event, waveValue: number | number[]) => {
  //   setWave(waveValue as number);
  //   setWaveSliderMoved(true);
  // };

  const DynamicSlider = () => {
    const [barrier, setBarrier] = useState(1);
    const [thickness, setThickness] = useState(1);
    const [wave, setWave] = useState(1);
    const [loading, setLoading] = useState(false);
  
    const handleBarrier = (_: Event, newValue: number | number[]) => setBarrier(newValue as number);
    const handleThickness = (_: Event, newValue: number | number[]) => setThickness(newValue as number);
    const handleWave = (_: Event, newValue: number | number[]) => setWave(newValue as number);
  
    const handleSubmitSlider = () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSnackbarMessage(`Model Generated with Barrier: ${barrier}, Thickness: ${thickness}, Wave: ${wave}`);
      }, 1000);
      setOpenSnackbar(true);
    };

  async function handleSubmit(event: any) {
    event.preventDefault();
    let barrier_str = barrier.toString();
    let thickness_str = thickness.toString();
    let wave_str = wave.toString();

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
        setSnackbarMessage(
          "Tunneling model generated with barrier = " +
            barrier_str +
            ", thickness = " +
            thickness_str +
            ", and wave = " +
            wave_str +
            "!"
        );
      }
      else {
        setSnackbarMessage("Failed to generate model.");
      }
      setLoading(false);
      setBarrierSliderMoved(false);
      setThicknessSliderMoved(false);
      setWaveSliderMoved(false);
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
          border: "1px solid #063970",
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
            <CustomInputSection
              barrier={barrier}
              handleBarrier={handleBarrier}
              thickness={thickness}
              handleThickness={handleThickness}
              wave={wave}
              handleWave={handleWave}
              handleSubmit={handleSubmitSlider}
              loading={loading}
            />
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

  return (
    <DynamicSlider />
  );
};

export default Tunneling;
