import React from "react";
import "./ButtonLoader.css";
const ButtonLoader = ({ size }) => {
  if (!size) {
    size = 30;
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <span className="loader"></span>
    </div>
  );
};

export default ButtonLoader;
