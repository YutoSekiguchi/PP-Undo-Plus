import { Dispatch, SetStateAction, useState } from "react";
import { EditorUtils } from "../../../util";
import LogList from "../../LogList/layout";
import { TLGroupVisualMode } from "@/@types/note";
import { Pdf, PdfPicker } from "../../../PdfEditor/PdfPicker";

interface Props {
  editorUtils: EditorUtils;
  id: number;
  width: string | number;
  height: string | number;
  background: string;
  isDemo: boolean;
  handleResetStrokePressureInfo: (allRecords: any) => void;
  pMode: "average" | "grouping";
  setPMode: Dispatch<SetStateAction<"grouping" | "average">>;
  setIsShowLayer: Dispatch<SetStateAction<boolean>>;
  groupVisualMode: TLGroupVisualMode;
  setGroupVisualMode: Dispatch<SetStateAction<TLGroupVisualMode>>;
  setIsSettingOpen: Dispatch<SetStateAction<boolean>>;
  onOpenPdf: (pdf: Pdf | null) => void;
}

export default function ButtonArea(props: Props) {
  const {
    editorUtils,
    id,
    width,
    height,
    background,
    isDemo,
    handleResetStrokePressureInfo,
    pMode,
    setPMode,
    setIsShowLayer,
    groupVisualMode,
    setGroupVisualMode,
    setIsSettingOpen,
    onOpenPdf,
  } = props;
  const [isOpen, setIsOpen] = useState(false);

  const nextGroupVisualMode = () => {
    switch (groupVisualMode) {
      case "area": return "line";
      case "line": return "none";
      case "none": return "area";
      default: return "none";
    }
  };

  const groupVisualLabel = () => {
    switch (groupVisualMode) {
      case "area": return "Area";
      case "line": return "Line";
      case "none": return "Off";
      default: return "—";
    }
  };

  return (
    <>
      {isOpen && (
        <LogList
          id={id}
          editorUtils={editorUtils}
          width={width}
          height={height}
          background={background}
          handleClose={() => setIsOpen(false)}
          isDemo={isDemo}
          handleResetStrokePressureInfo={handleResetStrokePressureInfo}
        />
      )}
      <div className="area" style={{ width: "100%" }}>
        <span className="section-title">Quick Actions</span>

        {/* Mode toggle row */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
          padding: "8px 10px",
          borderRadius: 10,
          background: "rgba(255, 255, 255, 0.025)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
        }}>
          <span style={{
            fontSize: 11,
            fontWeight: 500,
            color: "rgba(255, 255, 255, 0.45)",
          }}>
            Mode
          </span>
          <button
            onClick={() => setPMode(pMode === "average" ? "grouping" : "average")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 12px",
              borderRadius: 8,
              border: "1px solid rgba(139, 92, 246, 0.3)",
              background: "linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(99, 102, 241, 0.12))",
              color: "#c4b5fd",
              fontSize: 11,
              fontWeight: 600,
              fontFamily: "inherit",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <span style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: pMode === "average" ? "#8b5cf6" : "#06b6d4",
              boxShadow: `0 0 6px ${pMode === "average" ? "rgba(139,92,246,0.5)" : "rgba(6,182,212,0.5)"}`,
            }} />
            {pMode === "average" ? "Average" : "Grouping"}
          </button>
        </div>

        {/* Action buttons 2x2 grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 6,
        }}>
          <button className="action-btn primary" onClick={() => setIsOpen(true)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" /><polyline points="23 20 23 14 17 14" />
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
            </svg>
            History
          </button>

          <button className="action-btn success" onClick={() => setIsShowLayer(true)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
            Layers
          </button>

          <button className="action-btn info" onClick={() => setIsSettingOpen(true)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Settings
          </button>

          <button className="action-btn warning" onClick={() => setGroupVisualMode(nextGroupVisualMode())}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
            Visual: {groupVisualLabel()}
          </button>
        </div>

        {/* PDF picker row */}
        <div style={{
          marginTop: 8,
          paddingTop: 8,
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
        }}>
          <PdfPicker onOpenPdf={onOpenPdf} />
        </div>
      </div>
    </>
  );
}
