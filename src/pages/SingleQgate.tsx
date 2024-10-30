import { useState, useEffect, useRef } from "react";
// === UI Components ===
import {
  Grid,
  Box,
  Button,
  Select,
  Stack,
  SelectChangeEvent,
  Alert,
  Snackbar,
  MenuItem,
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

import infoFig from '../images/Single_V4.png';

// === styles ===
import { sidebar_style } from "../global_styles";
// const select_style = { backgroundColor: "#FFFFFF" };
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
const SpinTraceEvolution = () => {
  // ========= states =========
  const [loading, setLoading] = useState(false);
  const [gate, setGate] = useState<number>(1);
  const [initState, setInitState] = useState<number>(2);
  const [magF_B, setMagF_B] = useState<number>(10);
  const [t2, setT2] = useState<number>(0.1);
  const [animationJsHtml, setAnimationJsHtml] = useState('');
  const animationContainerRef = useRef<HTMLDivElement>(null);
  const [gateDropChanged, setGateDropChanged] = useState(false);
  const [initStateDropChanged, setInitStateDropChanged] = useState(false);
  const [magSliderMoved, setMagSliderMoved] = useState(false);
  const [t2SliderMoved, setT2SliderMoved] = useState(false);
  const [success_msg, set_Success_Msg] = useState(
    "Tunneling model generated with gate = " + gate.toString() + ", initState = " + initState.toString() + ", mag = " + magF_B.toString() + ", and t2 = " + t2.toString() + "!"
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
        fetch('/qgate1/trace_1_2_10_0.1_3D.html')
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

  const handleGateChange = (event: SelectChangeEvent) => {
    setGate(parseInt(event.target.value));
    setGateDropChanged(true);
  };

  const handleInitStateChange = (event: SelectChangeEvent) => {
    setInitState(parseInt(event.target.value));
    setInitStateDropChanged(true);
  };

  const handleMagChange = (event: Event, magValue: number | number[]) => {
    setMagF_B(magValue as number);
    setMagSliderMoved(true);
  };

  const handleT2Change = (event: Event, t2Value: number | number[]) => {
    setT2(t2Value as number);
    setT2SliderMoved(true);
  };

  async function handleSubmit(event: any) {
    event.preventDefault();
    let gate_str = gate.toString();
    let init_state_str = initState.toString();
    let mag_str = magF_B.toString();
    let t2_str = t2.toString();
    console.log("gate:", gate_str);
    console.log("initState:", init_state_str);
    console.log("magF_B:", mag_str);
    console.log("t2:", t2_str);

    let base_url = host + "/receive_data/evotrace"
    let final_url =
    base_url + "/" + gate_str +
    "/" + init_state_str +
    "/" + mag_str +
    "/" + t2_str;

    if (gateDropChanged || initStateDropChanged || magSliderMoved || t2SliderMoved) {
      setLoading(true);
      const gifData = await getGifFromServer(final_url);
      if (gifData) {
        set_Success_Msg(
          "SpinTraceEvolution model generated with gate = " +
            gate_str +
            ", initState = " +
            init_state_str +
            ", and mag = " +
            mag_str +
            ", and t2 = " +
            t2_str +
            "!"
        );
        setLoading(false);
        setGateDropChanged(false);
        setInitStateDropChanged(false);
        setMagSliderMoved(false);
        setT2SliderMoved(false);
      }
    }
    setOpenSnackbar(true); // open snackbar
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>

      <Content className="site-layout" style={{margin: "5%"}}>
        <CustomPageHeader text="Spin Qubit Trace" size="h3"/>
        {/*<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}*/}
        {/*     ref={animationContainerRef}></div>*/}
        <CustomDescriptionBox
            title='What is qubit and a "spin"?'
            msg={`In quantum computers, we use something called qubits to store information. Unlike regular computer bits (which are either 0 or 1), qubits can be a mix of both at the same time! One way we can control a qubit is by using the **spin** of a tiny particle, like an electron. Imagine the electron spinning like a top—this spin helps us control how the qubit behaves.`}
        />
        <CustomDescriptionBox
            title='How does spin change?'
            msg={`To control the spin of a particle, we apply a **magnetic field**. This makes the particle spin around in a circle! We measure how much it spins and use that to decide how well our quantum computer is working. The goal is to rotate the spin by just the right amount, which we call a **quantum gate**.`}
        />
        <CustomDescriptionBox
            title='The Bloch Sphere'
            imageUrl={infoFig}
            msg={`We can picture the spin of an electron using a model called the **Bloch sphere**. It’s like a globe, and the spin is a point on the surface of the globe that moves around as the magnetic field changes. By looking at the Bloch sphere, we can see exactly how the spin is moving!`}
        />
        <CustomDescriptionBox
            title='Try it out!'
            msg={`Now it’s your turn to explore! In this experiment, you can adjust the magnetic field and see how it affects the spin of a qubit. Watch how the qubit’s spin changes on the Bloch sphere. Can you find the right amount of spin for the quantum gate?`}
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
          <FormControl variant="filled">
              <InputLabel variant="standard" htmlFor="uncontrolled-native" style={{color: "white", fontSize: "1.3rem", textAlign: "center"}}>
                Initial State
              </InputLabel>
              <Select
                sx={{ color: "#000000" }}
                labelId="gate-select"
                value={gate.toString()}
                label="Gate"
                onChange={handleGateChange}
              >
                <MenuItem value={1}>X gate (x)</MenuItem>
                <MenuItem value={2}>Y gate (y)</MenuItem>
                <MenuItem value={3}>Z gate (z)</MenuItem>
                <MenuItem value={4}>Hadamard gate</MenuItem>
                <MenuItem value={5}>S gate</MenuItem>
                <MenuItem value={6}>T gate</MenuItem>
              </Select>
            </FormControl>

            {/* Init State Select */}
            <FormControl variant="filled">
              {/*<InputLabel*/}
              {/*  id="initState-select"*/}
              {/*  style={{color: "white", marginTop: "10px", marginBottom: "10px", textAlign: "center", fontSize: "1.3rem"}}*/}
              {/*  >*/}
              {/*  Initial State*/}
              {/*  </InputLabel>*/}
              <InputLabel variant="standard" htmlFor="uncontrolled-native" style={{color: "white", fontSize: "1.3rem", textAlign: "center"}}>
                Initial State
              </InputLabel>
              <Select
                sx={{ color: "#000000" }}
                labelId="initState-select"
                value={initState.toString()}
                label="Initial State"
                onChange={handleInitStateChange}
              >
                <MenuItem value={1}>|+&gt;</MenuItem>
                <MenuItem value={2}>|i+&gt;</MenuItem>
                <MenuItem value={3}>|0&gt;</MenuItem>
                <MenuItem value={4}>|-&gt;</MenuItem>
                <MenuItem value={5}>|i-&gt;</MenuItem>
                <MenuItem value={6}>|1&gt;</MenuItem>
              </Select>
            </FormControl>

            {/* Mag slider */}
            <FormControl variant="filled">
              <InputLabel
                id="mag-select"
                style={{color: "black", marginTop: "10px", marginBottom: "10px",textAlign: "center"}}
                >
                Magnetic field
                </InputLabel>
              <Slider
                sx={{ color: "#063970" }}
                aria-label="mag-select"
                value={magF_B}
                onChange={handleMagChange}
                min={0}
                max={50}
                defaultValue={10}
                valueLabelDisplay="auto"
                step={1}
              />
            </FormControl>

            {/* T2 slider */}
            <FormControl variant="filled">
              <InputLabel
                id="t2-select"
                style={{color: "black", marginTop: "10px", marginBottom: "10px", textAlign: "center"}}
                >
                Dephasing time
                </InputLabel>
              <Slider
                sx={{ color: "#063970" }}
                aria-label="t2-select"
                value={t2}
                onChange={handleT2Change}
                min={0.0}
                max={100}
                defaultValue={0.1}
                valueLabelDisplay="auto"
                step={0.1}
              />
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
        {/*<div ref={animationContainerRef}/>*/}
      </Content>
    </Layout>
  );
};

export default SpinTraceEvolution;