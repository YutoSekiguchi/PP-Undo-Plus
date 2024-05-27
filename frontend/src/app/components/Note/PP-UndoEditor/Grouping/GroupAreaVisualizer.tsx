import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

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
  updateGroupPressure: (
    groupArea: TLGroupDrawArea,
    avgPressure: number
  ) => void;
  isOperatingGroupID: number | null;
  setIsOperatingGroupID: Dispatch<SetStateAction<number | null>>;
  setAvgPressureForUpdateGroupPressure: Dispatch<SetStateAction<number[]>>;
  avgPressureForUpdateGroupPressure: number[];
}

const GroupAreaVisualizer: React.FC<Props> = ({
  groupAreas,
  width,
  height,
  zoomLevel,
  offsetX,
  offsetY,
  updateGroupPressure,
  isOperatingGroupID,
  setIsOperatingGroupID,
  setAvgPressureForUpdateGroupPressure,
  avgPressureForUpdateGroupPressure,
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

      const hue = Math.round(240 - groupPressure * 240);
      const color = `hsl(${hue}, 100%, 50%)`;

      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.5;

      const buffer = 2;
      const zoomedLeft = (left + offsetX - buffer) * zoomLevel;
      const zoomedTop = (top + offsetY - buffer) * zoomLevel;
      const zoomedWidth = (width + buffer * 2) * zoomLevel;
      const zoomedHeight = (height + buffer * 2) * zoomLevel;
      const cornerRadius = 5; // Adjust corner radius as needed

      // Draw rounded rectangle
      ctx.beginPath();
      ctx.moveTo(zoomedLeft + cornerRadius, zoomedTop);
      ctx.lineTo(zoomedLeft + zoomedWidth - cornerRadius, zoomedTop);
      ctx.quadraticCurveTo(zoomedLeft + zoomedWidth, zoomedTop, zoomedLeft + zoomedWidth, zoomedTop + cornerRadius);
      ctx.lineTo(zoomedLeft + zoomedWidth, zoomedTop + zoomedHeight - cornerRadius);
      ctx.quadraticCurveTo(zoomedLeft + zoomedWidth, zoomedTop + zoomedHeight, zoomedLeft + zoomedWidth - cornerRadius, zoomedTop + zoomedHeight);
      ctx.lineTo(zoomedLeft + cornerRadius, zoomedTop + zoomedHeight);
      ctx.quadraticCurveTo(zoomedLeft, zoomedTop + zoomedHeight, zoomedLeft, zoomedTop + zoomedHeight - cornerRadius);
      ctx.lineTo(zoomedLeft, zoomedTop + cornerRadius);
      ctx.quadraticCurveTo(zoomedLeft, zoomedTop, zoomedLeft + cornerRadius, zoomedTop);
      ctx.closePath();
      ctx.stroke();
    });
  }, [groupAreas, width, height, zoomLevel, offsetX, offsetY]);

  const UpdatePressureComponent = ({
    area,
    buttonX,
    buttonY,
    buttonSize,
    color,
  }: {
    area: TLGroupDrawArea;
    buttonX: number;
    buttonY: number;
    buttonSize: number;
    color: string;
  }) => {
    const [isPointerDown, setIsPointerDown] = useState<boolean>(false);
    const [pointerDownTime, setPointerDownTime] = useState<number | null>(null);
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const handlePointerDown = () => {
      setIsPointerDown(true);
      setPointerDownTime(Date.now());
      setIsOperatingGroupID(area.groupID);
    };

    const handlePointerUp = () => {
      // avgPressureForUpdateGroupPressureを最後から繰り返して，値が減ったところの一つ手前つまり減少し始めた場所で切り取る
      // その部分の平均値を求める
      // その平均値をupdateGroupPressureに渡す
      const pressureList = avgPressureForUpdateGroupPressure;
      const pressureListLength = pressureList.length;
      let lastPressure = pressureList[pressureListLength - 1];
      let i = pressureListLength - 2;
      for (; i >= 0; i--) {
        if (lastPressure > pressureList[i]) {
          break;
        }
        lastPressure = pressureList[i];
      }
      const avgPressure = pressureList.slice(i + 1).reduce((acc, cur) => acc + cur, 0) / (pressureListLength - i - 1);
      updateGroupPressure(area, avgPressure);

      setIsPointerDown(false);
      setPointerDownTime(null);
      setIsOperatingGroupID(null);
      setAvgPressureForUpdateGroupPressure([]);
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
      if (
        event.pressure !== undefined &&
        event.pressure !== 0 &&
        Date.now() - pointerDownTime! >= 500
      ) {
        const pressure = event.pointerType === 'pen' ? event.pressure : Math.random();
        const pressureList = [...avgPressureForUpdateGroupPressure, pressure]
        setAvgPressureForUpdateGroupPressure(pressureList)
        const avgAllPressures = pressureList.reduce((acc, cur) => acc + cur, 0) / pressureList.length;
        updateGroupPressure(area, pressure);
      }
    };

    const handlePointerEnter = () => {
      setIsHovered(true);
    };

    const handlePointerLeave = () => {
      setIsHovered(false);
      // handlePointerUp();
    };

    // const pressureColor =
    //   sumPressures !== 0 && moveCount !== 0
    //     ? `hsl(${Math.round(
    //         (1 - sumPressures / moveCount) * 120
    //       )}, 100%, 50%)`
    //     : color;

    const size =
      isHovered || isOperatingGroupID === area.groupID
        ? buttonSize * 5
        : buttonSize;

    return (
      <div
        style={{
          position: "absolute",
          left: buttonX - (size - buttonSize) / 2,
          top: buttonY - (size - buttonSize) / 2,
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor:color,
          opacity: 0.5,
          cursor: "pointer",
          pointerEvents: "auto",
          transition: "width 0.3s, height 0.3s, left 0.3s, top 0.3s",
          userSelect: "none",
        }}
        className="touch-none update-pressure-button"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      />
    );
  };
  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 999,
          pointerEvents: "none",
        }}
        className="grouping-canvas"
      />
      {groupAreas.map((area) => {
        const { left, top, width, height, groupID, groupPressure } = area;

        const hue = Math.round(240 - groupPressure * 240);
        const color = `hsl(${hue}, 100%, 50%)`;

        const buffer = 16;
        const zoomedLeft = (left + offsetX - buffer) * zoomLevel;
        const zoomedTop = (top + offsetY - buffer) * zoomLevel;
        const zoomedWidth = (width + buffer * 2) * zoomLevel;
        const zoomedHeight = (height + buffer * 2) * zoomLevel;

        const buttonSize = 12 * zoomLevel;
        const buttonX = zoomedLeft + zoomedWidth - buttonSize / 2;
        const buttonY = zoomedTop - buttonSize / 2;

        return (
          <UpdatePressureComponent
            key={groupID}
            area={area}
            buttonX={buttonX}
            buttonY={buttonY}
            buttonSize={buttonSize}
            color={color}
          />
        );
      })}
    </>
  );
};

export default GroupAreaVisualizer;
