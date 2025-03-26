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
  // CustomTitle,
} from "../components";

// === sub component imports ===
const { Content } = Layout;

// const horizontal_center = {
//   display: "flex",
//   // alignItems: "center",  # vertical center
//   justifyContent: "center",
// };

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
  const animationDivRef = useRef<HTMLDivElement>(null);
  const animationFlexRef = useRef<HTMLDivElement>(null);
  const [animationJsHtml, setAnimationJsHtml] = useState("");


  // === Ref Variables ===
  const inputRef = useRef<number[]>([0, 0, 0, 0]);


  // === Function to handle submit ===
  const handleSubmit = () => {
    setInput([...inputRef.current]);
    setLoading(true);
    fetch(`${host}/receive_data/qft`, {
      method: "GET",
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

  useEffect(() => {
    const loadDefaultHtml = async () => {
      try {
        console.log("triggered");
        fetch("/qft/qft_with_bloch_and_probs_6.html")
          .then((response) => response.text())
          .then((text) => {
            setAnimationJsHtml(text);
            // console.log(text);
          });
      } catch (error) {
        console.error("Failed to load default HTML content:", error);
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
        const newScript = document.createElement("script");
        newScript.text = script.text;
        container.appendChild(newScript);
        script.parentNode?.removeChild(script);
      });
    }
  }, [animationJsHtml]);

  let [scale, setState] = useState(1);
  const handleResize = () => {
    if (!animationFlexRef.current || !animationDivRef.current) return;

    const flexElement = animationFlexRef.current;
    const flexStyles = window.getComputedStyle(flexElement);

      // Get padding values
    const paddingTop = parseFloat(flexStyles.paddingTop) || 0;
    const paddingBottom = parseFloat(flexStyles.paddingBottom) || 0;
    const paddingLeft = parseFloat(flexStyles.paddingLeft) || 0;
    const paddingRight = parseFloat(flexStyles.paddingRight) || 0;

    // Calculate available width and height by subtracting padding
    const flexWidth = flexElement.offsetWidth - paddingLeft - paddingRight;
    const flexHeight = flexElement.offsetHeight - paddingTop - paddingBottom;

    // Known dimensions of the animation
    const animationWidth = 2000; // Animation's original width
    const animationHeight = 800; // Animation's original height

    // Calculate scale based on both width and height constraints
    const widthScale = flexWidth / animationWidth;
    const heightScale = flexHeight / animationHeight;

    console.log("Flex width (adjusted):", flexWidth);
    console.log("Flex height (adjusted):", flexHeight);
    console.log("Width scale:", widthScale);
    console.log("Height scale:", heightScale);

    const newScale = Math.min(widthScale, heightScale); // Ensure it fits within the flex container
    console.log("New scale:", newScale);

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
    <div className="layout">
      <div className="content">
        {/* Title for the page */}
        <CustomPageHeader text="Quantum Fourier Transform" size="h3" />

        {/* Content for the page imported from data.json */}
        <CustomDescriptionBox pageTitle="qft" />

        <Card data-type="bottom-card-qft" ref={animationFlexRef}>
          {/* Right Box */}
          <div
              style={{
                overflow: "clip",
                width: "100%",
                height: "100%",
              }}
            >
              <style>
                {`
                  .animation {
                    transform: scale(${scale});
                    transform-origin: top left;
                  }
                `}
              </style>
              <div
                style={{
                  backgroundColor: "white",
                  width: "100%",
                  height: "100%",
                }}
                ref={animationDivRef}
              />
            </div>
        </Card>
        {/* <Snackbar
          open={openSnackBar}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={() => setOpenSnackbar(false)} severity={severity}>
            {snackbar_msg}
          </Alert>
        </Snackbar> */}

      </div>
    </div>
  );
};

export default QuantumFourierTransform;
