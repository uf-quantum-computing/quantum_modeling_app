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
// === Components ===
import {
  VerticalMenu,
  CustomDescriptionBox,
  CustomPageHeader,
  CustomTitle,
} from "../components";
// === sub component imports ===
// === styles ===
const sidebar_style = {
  backgroundColor: "#333333",
  height: "100vh",
  minHeight: "100vh",
};
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
  // ========= states =========
  const [barrier, setBarrier] = useState("");
  const [thickness, setThickness] = useState("");
  const [wave, setWave] = useState("");
  const [tunneling_img2, set_Tunneling_img2d] = useState(
    "./model_images/tunneling/2DTunneling_1x1x1.gif"
  );
  const [tunneling_img3, set_Tunneling_img3d] = useState(
    "./model_images/tunneling/3DTunneling_1x1x1.gif"
  );
  const [success_msg, set_Success_Msg] = useState(
    "Wavefunction with mass = 1 & velocity = 10 generated!"
  );
  const [description_text, set_Description_Text] = useState(
    "Wavefunction with mass = 1 & velocity = 10 generated!"
  );
  // const [description_msg, set_Description_Msg] = useState(
  //   "Example Description Msg"
  // );
  const [open, setOpen] = useState(false);

  // ========= handle functions =========
  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    // function to close the snackbar
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
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
      "./model_images/tunneling/2DTunneling_" +
      barrier_str +
      "x" +
      thickness_str +
      "x" +
      wave_str +
      ".gif";
    let img_path_3D =
      "./model_images/tunneling/3DTunneling_" +
      barrier_str +
      "x" +
      thickness_str +
      "x" +
      wave_str +
      ".gif";
    set_Tunneling_img2d(img_path_2D);
    set_Tunneling_img3d(img_path_3D);
    set_Description_Text(
      "Wavefunction with mass = " +
        barrier_str +
        " & velocity = " +
        wave_str +
        " generated!"
    );
    set_Success_Msg(
      "Wavefunction with barrier = " +
        barrier_str +
        " & thickness = " +
        thickness_str +
        " & wave = " +
        wave_str +
        " generated!"
    );
  }

  // ========= return =========
  return (
    <div>
      <Grid container spacing={2}>
        {/* ================== left col ================== */}
        <Grid item xs={3} style={sidebar_style}>
          <div style={horizontal_center}>
            <CustomTitle />
          </div>

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
              <Button variant="contained" onClick={handleSubmit} type="submit">
                Generate Model
              </Button>

              {/* ====== VerticalMenu ====== */}
              <VerticalMenu />

              {/* ====== Snackbar ====== */}
              <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
              >
                <Alert
                  onClose={handleClose}
                  severity="success"
                  sx={{ width: "100%" }}
                >
                  {success_msg}
                </Alert>
              </Snackbar>

              {/* <p>{success_msg}</p> */}
            </Stack>
          </Box>
        </Grid>

        {/* ================== right col ================== */}
        <Grid item xs={8}>
          <CustomPageHeader text="Tunneling" size="h3" />

          <img src={tunneling_img2} alt="2D tunneling" style={img_style} />
          <img src={tunneling_img3} alt="3D tunneling function" />
          <CustomDescriptionBox msg={description_text} />
        </Grid>
      </Grid>
    </div>
  );
};

export default Tunneling;
