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
  combineGroupArea: (
    fromGroupArea: TLGroupDrawArea,
    toGroupArea: TLGroupDrawArea
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
  combineGroupArea,
  isOperatingGroupID,
  setIsOperatingGroupID,
  setAvgPressureForUpdateGroupPressure,
  avgPressureForUpdateGroupPressure,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [draggingGroupID, setDraggingGroupID] = useState<number | null>(null);
  const [connections, setConnections] = useState<
    { from: number; to: number }[]
  >([]);
  const [dragging, setDragging] = useState<boolean>(false);
  const [draggingOverGroupID, setDraggingOverGroupID] = useState<number | null>(
    null
  );
  const [draggingPosition, setDraggingPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

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

    // グループごとに中心点を計算して線を描画
    const groupCenters: { [key: number]: { x: number; y: number } } = {};

    groupAreas.forEach((area) => {
      const { left, top, width, height, groupID } = area;

      const buffer = 2;
      const zoomedLeft = (left + offsetX - buffer) * zoomLevel;
      const zoomedTop = (top + offsetY - buffer) * zoomLevel;
      const zoomedWidth = (width + buffer * 2) * zoomLevel;
      const zoomedHeight = (height + buffer * 2) * zoomLevel;

      const centerX = zoomedLeft + zoomedWidth / 2;
      const centerY = zoomedTop + zoomedHeight / 2;

      groupCenters[groupID] = { x: centerX, y: centerY };
    });

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
      ctx.quadraticCurveTo(
        zoomedLeft + zoomedWidth,
        zoomedTop,
        zoomedLeft + zoomedWidth,
        zoomedTop + cornerRadius
      );
      ctx.lineTo(
        zoomedLeft + zoomedWidth,
        zoomedTop + zoomedHeight - cornerRadius
      );
      ctx.quadraticCurveTo(
        zoomedLeft + zoomedWidth,
        zoomedTop + zoomedHeight,
        zoomedLeft + zoomedWidth - cornerRadius,
        zoomedTop + zoomedHeight
      );
      ctx.lineTo(zoomedLeft + cornerRadius, zoomedTop + zoomedHeight);
      ctx.quadraticCurveTo(
        zoomedLeft,
        zoomedTop + zoomedHeight,
        zoomedLeft,
        zoomedTop + zoomedHeight - cornerRadius
      );
      ctx.lineTo(zoomedLeft, zoomedTop + cornerRadius);
      ctx.quadraticCurveTo(
        zoomedLeft,
        zoomedTop,
        zoomedLeft + cornerRadius,
        zoomedTop
      );
      ctx.closePath();
      ctx.stroke();
    });

    if (dragging && draggingPosition && draggingGroupID !== null) {
      const groupCenter = groupCenters[draggingGroupID];
      if (groupCenter) {
        ctx.strokeStyle = "rgba(255,0,0,0.5)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(groupCenter.x, groupCenter.y);
        ctx.lineTo(draggingPosition.x, draggingPosition.y);
        ctx.stroke();
      }
    }
  }, [
    groupAreas,
    width,
    height,
    zoomLevel,
    offsetX,
    offsetY,
    connections,
    dragging,
    draggingPosition,
  ]);

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
    // const [dragStartPosition, setDragStartPosition] = useState<{ x: number; y: number } | null>(null);

    let dragStartPosition: { x: number; y: number } | null = null;

    let updatePressureList: number[] = [];

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      setIsPointerDown(true);
      setPointerDownTime(Date.now());
      setIsOperatingGroupID(area.groupID);
      setDraggingGroupID(area.groupID);
      // setDragStartPosition({ x: e.clientX, y: e.clientY });
      dragStartPosition = { x: e.clientX, y: e.clientY };
      setDraggingPosition({ x: e.clientX, y: e.clientY });
      updatePressureList = [];

      // ドキュメント全体に対してポインタムーブとポインタアップのイベントリスナーを追加
      document.addEventListener("pointermove", handleDocumentPointerMove);
      document.addEventListener("pointerup", handleDocumentPointerUp);
    };

    const handleDocumentPointerMove = (event: PointerEvent) => {
      // ドラッグ開始位置から一定距離を超えた場合、ドラッグ状態に移行
      if (dragStartPosition) {
        const dx = event.clientX - dragStartPosition.x;
        const dy = event.clientY - dragStartPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const buffer = 16 * zoomLevel; // Adjust this value as needed
        if (distance > buffer) {
          setDragging(true);
          setDraggingPosition({ x: event.clientX, y: event.clientY });
        } else {
          const pressure =
            event.pointerType === "pen" ? event.pressure : Math.random();
          const pressureList = [...avgPressureForUpdateGroupPressure, pressure];
          updatePressureList.push(pressure);
          // console.log(updatePressureList)
          setAvgPressureForUpdateGroupPressure(updatePressureList);
          const avgAllPressures =
            updatePressureList.reduce((acc, cur) => acc + cur, 0) /
            updatePressureList.length;
          updateGroupPressure(area, avgAllPressures);
        }
      }
      // }
    };

    const handleDocumentPointerUp = () => {
      if (isPointerDown) {
        const pressureList = updatePressureList;
        const pressureListLength = pressureList.length;
        let lastPressure = pressureList[pressureListLength - 1];
        let i = pressureListLength - 2;
        for (; i >= 0; i--) {
          if (lastPressure > pressureList[i]) {
            break;
          }
          lastPressure = pressureList[i];
        }
        const avgPressure =
          pressureList.slice(i + 1).reduce((acc, cur) => acc + cur, 0) /
          (pressureListLength - i - 1);
        updateGroupPressure(area, avgPressure);

        setIsPointerDown(false);
        setPointerDownTime(null);
        setIsOperatingGroupID(null);
        setAvgPressureForUpdateGroupPressure([]);
        setDraggingGroupID(null);
        setDragging(false);
        // setDragStartPosition(null);
        dragStartPosition = null;
        setDraggingPosition(null);
        setIsHovered(false);

        // ドキュメント全体に対するポインタムーブとポインタアップのイベントリスナーを削除
        document.removeEventListener("pointermove", handleDocumentPointerMove);
        document.removeEventListener("pointerup", handleDocumentPointerUp);
      }
      setIsPointerDown(false);
      setPointerDownTime(null);
      setIsOperatingGroupID(null);
      setAvgPressureForUpdateGroupPressure([]);
      setDraggingGroupID(null);
      setDragging(false);
      // setDragStartPosition(null);
      dragStartPosition = null;
      setDraggingPosition(null);
      setIsHovered(false);
      updatePressureList = [];
      document.removeEventListener("pointermove", handleDocumentPointerMove);
      document.removeEventListener("pointerup", handleDocumentPointerUp);
    };

    const handlePointerEnter = () => {
      setIsHovered(true);
      if (dragging) {
        setDraggingOverGroupID(area.groupID);
      }
    };

    const handlePointerLeave = () => {
      setIsHovered(false);
      setDraggingOverGroupID(null);
    };

    const handleDrop = (event: React.PointerEvent) => {
      if (draggingGroupID !== null) {
        const dropX = event.clientX;
        const dropY = event.clientY;

        const targetArea = groupAreas.find((area) => {
          const buffer = 16;
          const zoomedLeft = (area.left + offsetX - buffer) * zoomLevel;
          const zoomedTop = (area.top + offsetY - buffer) * zoomLevel;
          const zoomedWidth = (area.width + buffer * 2) * zoomLevel;
          const zoomedHeight = (area.height + buffer * 2) * zoomLevel;

          return (
            dropX >= zoomedLeft &&
            dropX <= zoomedLeft + zoomedWidth &&
            dropY >= zoomedTop &&
            dropY <= zoomedTop + zoomedHeight
          );
        });

        if (targetArea) {
          setConnections((prevConnections) => [
            ...prevConnections,
            { from: draggingGroupID, to: targetArea.groupID },
          ]);
          // groupAreasでidがdraggingGroupIDのもの
          const draggingArea = groupAreas.find(
            (area) => area.groupID === draggingGroupID
          );
          if (draggingArea !== undefined) {
            combineGroupArea(draggingArea, targetArea);
          }
        }
      }
      setDraggingGroupID(null);
      setDraggingOverGroupID(null);
      setDragging(false);
      setDraggingPosition(null);
      setIsHovered(false);
    };

    const size =
      isHovered || isOperatingGroupID === area.groupID
        ? buttonSize * 5
        : buttonSize;

    return (
      <div
        style={{
          position: "absolute",
          left:
            dragging && draggingPosition
              ? draggingPosition.x - size / 2
              : buttonX - (size - buttonSize) / 2,
          top:
            dragging && draggingPosition
              ? draggingPosition.y - size / 2
              : buttonY - (size - buttonSize) / 2,
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: color,
          opacity: draggingOverGroupID === area.groupID ? 0.8 : 0.5,
          cursor: "pointer",
          pointerEvents: "auto",
          transition:
            "width 0.3s, height 0.3s, left 0.3s, top 0.3s, opacity 0.3s",
          userSelect: "none",
          border:
            draggingOverGroupID === area.groupID ? "2px solid #000" : "none",
          zIndex: dragging ? 1000 : 1, // ドラッグ中の要素を前面に表示
        }}
        className="touch-none update-pressure-button"
        onPointerDown={handlePointerDown}
        onPointerMove={(e) => e.preventDefault()} // Prevent default move behavior
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerUp={handleDrop} // Handle drop on pointer up
        onPointerOver={(e) => e.preventDefault()}
        draggable={dragging}
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
