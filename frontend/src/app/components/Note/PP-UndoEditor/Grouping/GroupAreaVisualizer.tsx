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

      const hue = Math.round((1 - groupPressure) * 240);
      const color = `hsl(${hue}, 100%, 50%)`;

      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;

      const buffer = 16;
      const zoomedLeft = (left + offsetX - buffer) * zoomLevel;
      const zoomedTop = (top + offsetY - buffer) * zoomLevel;
      const zoomedWidth = (width + buffer * 2) * zoomLevel;
      const zoomedHeight = (height + buffer * 2) * zoomLevel;

      ctx.strokeRect(zoomedLeft, zoomedTop, zoomedWidth, zoomedHeight);
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
    let pressures: number[] = [];
    const [isPointerDown, setIsPointerDown] = useState<boolean>(false);
    const [pointerDownTime, setPointerDownTime] = useState<number | null>(null);
    const [isHovered, setIsHovered] = useState<boolean>(false);

    useEffect(() => {
      let timer: NodeJS.Timeout;
      if (isPointerDown && pointerDownTime) {
        const elapsedTime = Date.now() - pointerDownTime;
        if (elapsedTime >= 500) {
          timer = setTimeout(() => {
            pressures = pressures;
          }, 0);
        }
      } else {
        pressures = [];
      }
      return () => {
        clearTimeout(timer);
      };
    }, [isPointerDown, pointerDownTime]);

    const handlePointerDown = () => {
      setIsPointerDown(true);
      setPointerDownTime(Date.now());
      setIsOperatingGroupID(area.groupID);
    };

    const handlePointerUp = () => {
      setIsPointerDown(false);
      setPointerDownTime(null);
      setIsOperatingGroupID(null);
      pressures = [];
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
      if (
        event.pressure !== undefined &&
        event.pressure !== 0 &&
        Date.now() - pointerDownTime! >= 500
      ) {
        const random = Math.random();
        const allPressures = [...pressures, random];
        const avgAllPressures =
          allPressures.reduce((a, b) => a + b, 0) / allPressures.length;
        updateGroupPressure(area, avgAllPressures);
        pressures = allPressures;
      }
    };

    const handlePointerEnter = () => {
      setIsHovered(true);
    };

    const handlePointerLeave = () => {
      setIsHovered(false);
      handlePointerUp();
    };

    const pressureColor =
      pressures.length !== 0
        ? `hsl(${Math.round(
            (1 - pressures.reduce((a, b) => a + b, 0) / pressures.length) * 240
          )}, 100%, 50%)`
        : color;

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
          backgroundColor: pressureColor,
          zIndex: 10000,
          opacity: 0.75,
          cursor: "pointer",
          pointerEvents: "auto",
          transition: "width 0.3s, height 0.3s, left 0.3s, top 0.3s",
        }}
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
          zIndex: 9999,
          pointerEvents: "none",
        }}
        className="grouping-canvas"
      />
      {groupAreas.map((area) => {
        const { left, top, width, height, groupID, groupPressure } = area;

        const hue = Math.round((1 - groupPressure) * 240);
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
