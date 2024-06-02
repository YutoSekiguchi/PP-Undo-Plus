import { TLGroupDrawArea } from "@/@types/note";
import { TLShapeId } from "@tldraw/tldraw";
import { useEffect, useRef, useState } from "react";
import { EditorUtils } from "../util";

interface Props {
  groupAreas: TLGroupDrawArea[];
  editorUtils?: EditorUtils;
  setIsShowLayer: (isShowLayer: boolean) => void;
}

export default function PPLayerVisualizer(props: Props) {
  const { groupAreas, editorUtils, setIsShowLayer } = props;

  const [shapeList, setShapeList] = useState<
    { groupID: number; shapes: TLShapeId[] }[]
  >([]);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState<{
    index: number;
    shapes: TLShapeId[];
  } | null>(null);

  useEffect(() => {
    if (groupAreas.length === 0) return;
    // groupAreasをgroupPressureが小さい順に並べる
    const sortedGroupAreas = groupAreas.sort(
      (a, b) => a.groupPressure - b.groupPressure
    );
    // sortedGroupAreasの要素のidsの中身を全て出力
    const newShapeList = sortedGroupAreas.map((groupArea) => {
      let shapes: TLShapeId[] = [];
      groupArea.ids.forEach((id) => {
        shapes.push(id as TLShapeId);
      });
      return {
        groupID: groupArea.groupID,
        shapes: shapes,
      };
    });
    setShapeList(newShapeList);

    // アニメーションを開始
    setAnimationStarted(true);
  }, [groupAreas]);

  type LayerProps = {
    index: number;
    shapes: TLShapeId[];
    isSelected: boolean;
    onClick: () => void;
  };

  const Layer: React.FC<LayerProps> = ({
    index,
    shapes,
    isSelected,
    onClick,
  }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);

    useEffect(() => {
      const getSvg = async () => {
        const svgElement = await editorUtils?.getSvgWithStroke(shapes);
        if (svgElement && svgRef.current) {
          svgRef.current.innerHTML = "";
          svgRef.current.appendChild(svgElement);
        }
      };
      getSvg();
    }, [shapes]);

    const layerStyle = {
      "--translateX": `${index * 75}px`,
      "--translateZ": `${index * -100}px`,
      clipPath: "polygon(0 0, 100% 10%, 100% 85%, 0% 100%)",
    } as React.CSSProperties;

    const hoverStyle = {
      transform: `translateX(${index * 75}px) translateZ(${
        index * -100
      }px) rotateY(0deg) scale(1.5)`,
      transition: "transform 0.3s ease, z-index 0s",
      zIndex: 10,
    };

    const normalStyle = {
      transform: `translateX(${index * 75}px) translateZ(${
        index * -100
      }px) rotateY(-10deg)`,
      transition: "transform 0.3s ease",
      zIndex: isSelected ? 20 : 1,
    };

    return (
      <div
        className={`absolute top-1/2 left-1/4 w-96 h-72 border border-cyan-600 bg-cyan-800 bg-opacity-40 hover:bg-opacity-100 hover:bg-white flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 object-contain ${
          animationStarted ? "layer-animation" : ""
        }`}
        style={{
          ...(hoverIndex !== null ? hoverStyle : normalStyle),
          ...layerStyle,
        }}
        onMouseEnter={() => setHoverIndex(index)}
        onMouseLeave={() => setHoverIndex(null)}
        onClick={onClick}
      >
        <div ref={svgRef as React.RefObject<HTMLDivElement>}></div>
        {(hoverIndex === index || hoverIndex === null) && (
          <div className="absolute bottom-2 left-2 text-gray-400 p-1">
            {index + 1}
          </div>
        )}
      </div>
    );
  };

  const SelectedLayer: React.FC<{
    layer: { index: number; shapes: TLShapeId[] };
  }> = ({ layer }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
      const getSvg = async () => {
        const svgElement = await editorUtils?.getSvgWithStroke(layer.shapes);
        if (svgElement && svgRef.current) {
          svgRef.current.innerHTML = "";
          svgRef.current.appendChild(svgElement);
        }
      };
      getSvg();
    }, [layer.shapes]);

    return (
      <div className="fixed top-16 left-1/2 transform -translate-x-1/2 w-96 h-72 border-cyan-600 border-2 bg-white flex items-center justify-center z-50">
        <div ref={svgRef as React.RefObject<HTMLDivElement>}></div>
      </div>
    );
  };

  const LayerViewer: React.FC = () => {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {shapeList.map((shape, index) => (
          <Layer
            key={shape.groupID}
            index={index}
            shapes={shape.shapes}
            isSelected={selectedLayer?.index === index}
            onClick={() => setSelectedLayer({ index, shapes: shape.shapes })}
          />
        ))}
        {selectedLayer && <SelectedLayer layer={selectedLayer} />}
      </div>
    );
  };

  return (
    <div className="w-full h-screen flex items-center justify-center relative bg-black">
      <button
        className="absolute bottom-4 right-4 p-2 text-white rounded z-50 text-xs"
        onClick={() => setIsShowLayer(false)}
      >
        閉じる
      </button>
      <LayerViewer />
    </div>
  );
}
