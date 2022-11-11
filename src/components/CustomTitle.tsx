import React from "react";

const custom_divider = (
  <div style={{ textAlign: "center" }}>
    <hr
      style={{
        color: "#444444",
        height: "0.1px",
        width: "100%",
      }}
    />
  </div>
);
// ==========================================
// ==============  CustomTitle ==============
// ==========================================
const CustomTitle = () => {
  return (
    <div>
      <h2 style={{ color: "#FFFFFF", textAlign: "center" }}>
        Quantum Modeling App
      </h2>
      {custom_divider}
    </div>
  );
};

export default CustomTitle;
