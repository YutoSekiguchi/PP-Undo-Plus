import React from "react";
import "./LoadingScreen.css";

const LoadingScreen = () => {
  return (
    <div className="loading-container">
      <div className="loading-wrapper">
        <div className="loading-circle circle1"></div>
        <div className="loading-circle circle2"></div>
        <div className="loading-circle circle3"></div>
        <div className="loading-shadow"></div>
        <div className="loading-shadow"></div>
        <div className="loading-shadow"></div>
        <span>Loading…</span>
      </div>
    </div>
  );
};

export default LoadingScreen;
