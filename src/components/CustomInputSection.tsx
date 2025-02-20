import React, { useState } from "react";
import {
  Box,
  Stack,
  FormControl,
  InputLabel,
  Slider,
  Typography,
  Button,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import CustomTitle from "./CustomTitle";

interface CustomInputSectionProps {
  barrier: number;
  handleBarrier: (event: Event, value: number | number[]) => void;
  thickness: number;
  handleThickness: (event: Event, value: number | number[]) => void;
  wave: number;
  handleWave: (event: Event, value: number | number[]) => void;
  handleSubmit: () => void;
  loading: boolean;
}

const CustomInputSection: React.FC<CustomInputSectionProps> = ({
  barrier,
  handleBarrier,
  thickness,
  handleThickness,
  wave,
  handleWave,
  handleSubmit,
  loading,
}) => {
  const [isAdvanced, setIsAdvanced] = useState(false);

  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 0.5, width: "25ch" },
        padding: "10px",
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
          <Typography variant="body2" color="white" align="right">
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
          <Typography variant="body2" color="white" align="right">
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
          <Typography variant="body2" color="white" align="right">
            (nm)<sup>-1</sup>
          </Typography>
        </FormControl>

        {/* ====== Submit Button ====== */}
        {loading ? (
          <CircularProgress />
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
  );
};

export default CustomInputSection;