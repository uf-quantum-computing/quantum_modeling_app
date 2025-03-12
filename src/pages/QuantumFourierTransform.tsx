import { useState, useEffect, useRef, SetStateAction } from "react";
// === UI Components ===
import {
  Alert,
  AlertProps,
  Box,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  InputLabel,
  Slider,
  Snackbar,
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

const QuantumFourierTransform = () => {
  // === State Variables ===
  const [input, setInput] = useState<number[]>([0, 0, 0, 0]);
  const [output, setOutput] = useState<number[]>([0, 0, 0, 0]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [openError, setOpenError] = useState<boolean>(false);
  const [openSuccess, setOpenSuccess] = useState<boolean>(false);

  // === Ref Variables ===
  const inputRef = useRef<number[]>([0, 0, 0, 0]);

  // === Function to handle input change ===
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const index = parseInt(event.target.id);
    const value = parseInt(event.target.value);
    inputRef.current[index] = value;
  };

  // === Function to handle slider change ===
  const handleSliderChange =
    (index: number) => (event: Event, value: number | number[]) => {
      inputRef.current[index] = value as number;
      setInput([...inputRef.current]);
    };

  // === Function to handle checkbox change ===
  const handleCheckboxChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      inputRef.current[index] = event.target.checked ? 1 : 0;
      setInput([...inputRef.current]);
    };

  // === Function to handle submit ===
  const handleSubmit = () => {
    setInput([...inputRef.current]);
    setLoading(true);
    fetch(`${host}/qft`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: inputRef.current }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error in processing the request");
        }
        return response.json();
      })
      .then((data) => {
        setOutput(data.output);
        setLoading(false);
        setOpenSuccess(true);
      })
      .catch((error) => {
        setLoading(false);
        setError(true);
        setErrorMessage(error.message);
        setOpenError(true);
      });
  };

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
        <CustomPageHeader text="Quantum Fourier Transform" size="h3" />

        {/* Content for the page imported from data.json */}
        <CustomDescriptionBox pageTitle="qft" />


      </Content>
    </Layout>
  );
};

export default QuantumFourierTransform;
