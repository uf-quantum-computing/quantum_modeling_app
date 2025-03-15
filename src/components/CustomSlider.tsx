import React from 'react';
import { FormControl, Slider, SliderProps, Typography } from '@mui/material';


interface CustomSliderProps extends SliderProps {
  value: number | number[];
  onChange: (event: Event, newValue: number | number[]) => void;
  label: React.ReactNode | string;
  isAdvanced?: boolean;
}

const CustomSlider: React.FC<CustomSliderProps> = ({ value, onChange, label, isAdvanced, ...props }) => {
  return (
    <FormControl variant="filled">
      <Slider
        sx={{ color: isAdvanced ? "darkred" : "#063970" }}
        value={value}
        onChange={onChange}
        valueLabelDisplay="auto"
        marks={!isAdvanced}
        {...props}
      />
      <Typography variant="body1" color="black" align="left">
        {label}
      </Typography>
    </FormControl>
  );
};

export default CustomSlider;