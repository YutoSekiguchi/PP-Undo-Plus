import { Editor } from "tldraw";
import PPUndoArea from "./Areas/PP-UndoArea/layout";
import AllAveragePressurePieGraphArea from "./Areas/AllAveragePressurePieGraphArea/layout";
import StrokeStatsArea from "./Areas/StrokeStatsArea/layout";
import { EditorUtils } from "../util";
import ButtonArea from "./Areas/ButtonArea/layout";
import ChangeParametersArea from "./Areas/ChangeParametersArea/layout";
import { Dispatch, SetStateAction } from "react";
import { TLGroupVisualMode } from "@/@types/note";
import { Pdf } from "../PdfEditor/PdfPicker";

interface Props {
  width: string | number;
  height: string | number;
  padding: string | number;
  background: string;
  isDebugMode?: boolean;
  editor?: Editor;
  hideAllAveragePressurePieGraph?: boolean;
  allAveragePressurePieGraphWidth?: string | number;
  buttonAreaWidth?: string | number;
  editorUtils?: EditorUtils;
  id: number;
  isDemo: boolean;
  handleResetStrokePressureInfo: (allRecords: any) => void;
  wTime: number;
  setWTime: Dispatch<SetStateAction<number>>;
  wPressure: number;
  setWPressure: Dispatch<SetStateAction<number>>;
  wDistance: number;
  setWDistance: Dispatch<SetStateAction<number>>;
  boundaryValue: number;
  setBoundaryValue: Dispatch<SetStateAction<number>>;
  pMode: "average" | "grouping";
  setPMode: Dispatch<SetStateAction<"grouping" | "average">>;
  setIsSettingOpen: Dispatch<SetStateAction<boolean>>;
  setIsShowLayer: Dispatch<SetStateAction<boolean>>;
  groupVisualMode: TLGroupVisualMode;
  setGroupVisualMode: Dispatch<SetStateAction<TLGroupVisualMode>>;
  onOpenPdf: (pdf: Pdf | null) => void;
}

export default function PPUndoGraph(props: Props) {
  const {
    width,
    height,
    padding,
    background,
    isDebugMode = false,
    hideAllAveragePressurePieGraph = false,
    editor,
    editorUtils,
    id,
    isDemo,
    handleResetStrokePressureInfo,
    wTime,
    setWTime,
    wPressure,
    setWPressure,
    wDistance,
    setWDistance,
    boundaryValue,
    setBoundaryValue,
    pMode,
    setPMode,
    setIsSettingOpen,
    setIsShowLayer,
    groupVisualMode,
    setGroupVisualMode,
    onOpenPdf
  } = props;

  return (
    <div>
      <div
        style={{
          width: width,
          height: height,
          padding: typeof padding === "number" ? `${padding}px` : padding,
          background: "linear-gradient(180deg, #0c0c11 0%, #111118 50%, #0c0c11 100%)",
          zIndex: 9999,
          position: "fixed",
          border: "none",
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
          fontSize: 13,
          borderLeft: "1px solid rgba(255, 255, 255, 0.06)",
          overflow: "auto",
          scrollbarWidth: "thin" as any,
          scrollbarColor: "rgba(255,255,255,0.06) transparent",
        }}
        className="panel-scrollbar"
      >
        {/* Section 1: Pressure Threshold + Graph */}
        <PPUndoArea
          editor={editor}
          id={id}
          editorUtils={editorUtils}
          pMode={pMode}
          isDemo={isDemo}
        />

        {/* Section 2: Visualizations Row - AvgPressure + StrokeStats */}
        <div style={{
          marginTop: 12,
          display: "flex",
          gap: 8,
          alignItems: "stretch",
          minHeight: 0,
        }}>
          {!hideAllAveragePressurePieGraph && (
            <AllAveragePressurePieGraphArea />
          )}
          <StrokeStatsArea />
        </div>

        {/* Section 3: Quick Actions Toolbar */}
        {editorUtils && (
          <div style={{ marginTop: 12 }}>
            <ButtonArea
              editorUtils={editorUtils}
              id={id}
              width={width}
              height={height}
              background={background}
              isDemo={isDemo}
              handleResetStrokePressureInfo={handleResetStrokePressureInfo}
              setPMode={setPMode}
              pMode={pMode}
              setIsShowLayer={setIsShowLayer}
              groupVisualMode={groupVisualMode}
              setGroupVisualMode={setGroupVisualMode}
              setIsSettingOpen={setIsSettingOpen}
              onOpenPdf={onOpenPdf}
            />
          </div>
        )}

        {/* Section 4: Parameters */}
        <div style={{ marginTop: 12 }}>
          <ChangeParametersArea
            id={id}
            editorUtils={editorUtils}
            isDemo={isDemo}
            wTime={wTime}
            setWTime={setWTime}
            wPressure={wPressure}
            setWPressure={setWPressure}
            wDistance={wDistance}
            setWDistance={setWDistance}
            boundaryValue={boundaryValue}
            setBoundaryValue={setBoundaryValue}
          />
        </div>

        {/* Footer spacer */}
        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}
