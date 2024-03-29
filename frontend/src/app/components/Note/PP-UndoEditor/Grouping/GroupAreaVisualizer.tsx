import React, { useEffect, useRef } from "react";

interface TLGroupDrawArea {
  ids: string[];
  left: number;
  top: number;
  width: number;
  height: number;
  groupID: number;
  groupPressure: number;
}

interface Props {
  groupAreas: TLGroupDrawArea[];
  width: string;
  height: string;
  zoomLevel: number;
  offsetX: number;
  offsetY: number;
}

const GroupAreaVisualizer: React.FC<Props> = ({
  groupAreas,
  width,
  height,
  zoomLevel,
  offsetX,
  offsetY,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.warn("Canvas ref is not available");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.warn("Canvas 2D context is not available");
      return;
    }

    const getCanvasSize = (value: string) => {
      const match = value.match(/^(\d+)(vw|vh)$/);
      if (!match) return 0;

      const [_, size, unit] = match;
      const viewportSize =
        unit === "vw"
          ? Math.max(
              document.documentElement.clientWidth,
              window.innerWidth || 0
            )
          : Math.max(
              document.documentElement.clientHeight,
              window.innerHeight || 0
            );

      return (parseFloat(size) * viewportSize) / 100;
    };

    const canvasWidth = getCanvasSize(width);
    const canvasHeight = getCanvasSize(height);

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    groupAreas.forEach((area) => {
      const { left, top, width, height, groupPressure } = area;

      const red = Math.round(groupPressure * 255);
      const blue = Math.round((1 - groupPressure) * 255);
      const color = `rgba(${red}, 0, ${blue}, 0.5)`;

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;

      const buffer = 20;
      const zoomedLeft = (left + offsetX - buffer) * zoomLevel;
      const zoomedTop = (top + offsetY - buffer) * zoomLevel;
      const zoomedWidth = (width + buffer * 2) * zoomLevel;
      const zoomedHeight = (height + buffer * 2) * zoomLevel;

      ctx.strokeRect(zoomedLeft, zoomedTop, zoomedWidth, zoomedHeight);
    });
  }, [groupAreas, width, height, zoomLevel, offsetX, offsetY]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 9999,
      }}
      className="grouping-canvas"
    />
  );
};

export default GroupAreaVisualizer;
