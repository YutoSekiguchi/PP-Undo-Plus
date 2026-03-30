import { useEffect, useState } from "react";
import { EditorUtils } from "../../util";
import "./style.css";
import { TLNoteLogData } from "@/@types/note";
import { getNoteLogsByNoteID } from "@/app/lib/note_log";
import { formatDate } from "@/app/modules/common/formatDate";
interface Props {
  id: number;
  editorUtils: EditorUtils;
  width: string | number;
  height: string | number;
  background: string;
  handleClose: () => void;
  isDemo: boolean;
  handleResetStrokePressureInfo: (allRecords: any) => void;
}

export default function LogList(props: Props) {
  const {
    editorUtils,
    id,
    width,
    height,
    background,
    handleClose,
    isDemo,
    handleResetStrokePressureInfo,
  } = props;

  const [logs, setLogs] = useState<TLNoteLogData[]>([]);

  const handleClickLog = (log: TLNoteLogData) => () => {
    const snapshot = log.Snapshot;
    if (snapshot === "" || snapshot === null) return;
    editorUtils.loadSnapshot(JSON.parse(snapshot));
    handleResetStrokePressureInfo(editorUtils.getAllRecords());
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  };

  useEffect(() => {
    const getLogs = async () => {
      if (isDemo) return;
      const res = await getNoteLogsByNoteID(id);
      if (res === null) return;
      setLogs(res);
    };

    getLogs();
  }, []);

  return (
    <div
      className="log-panel"
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: width,
        height: height,
        background: "linear-gradient(180deg, #0f0f14 0%, #13131a 50%, #0f0f14 100%)",
        zIndex: 99999,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
        color: "#e4e4e7",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 20px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" /><polyline points="23 20 23 14 17 14" />
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
          </svg>
          <span style={{
            fontSize: 13,
            fontWeight: 600,
          }}>
            History
          </span>
          <span style={{
            fontSize: 11,
            fontWeight: 500,
            padding: "2px 8px",
            borderRadius: 6,
            background: "rgba(139, 92, 246, 0.15)",
            color: "#a78bfa",
            border: "1px solid rgba(139, 92, 246, 0.25)",
          }}>
            {logs.length}
          </span>
        </div>
        <button
          onClick={handleClose}
          style={{
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: 8,
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "rgba(255, 255, 255, 0.4)",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
            e.currentTarget.style.color = "rgba(255, 255, 255, 0.4)";
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Content */}
      {isDemo ? (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          gap: 8,
          color: "rgba(255, 255, 255, 0.3)",
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span style={{ fontSize: 13 }}>Not available in demo mode</span>
        </div>
      ) : (
        <div className="loglist-grid">
          {logs.map((log: TLNoteLogData, i: number) => (
            <div
              key={i}
              className="log-card"
              onClick={handleClickLog(log)}
            >
              <div className="log-card-img">
                {log.SvgPath !== "" && (
                  <img
                    src={
                      process.env.FILE_SERVER_URL +
                      "/svgs/" +
                      log.SvgPath +
                      ".svg"
                    }
                    onError={handleImageError}
                    alt={`Snapshot ${i + 1}`}
                  />
                )}
              </div>
              <div className="log-card-date">
                {formatDate(log.UpdatedAt)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
