import { TLNoteSettings } from "@/@types/note";
import "./toggle.css";

interface Props {
  settings: TLNoteSettings;
  setSettings: (settings: TLNoteSettings) => void;
  pMode: "average" | "grouping";
  setPMode: (pMode: "average" | "grouping") => void;
  onClose: () => void;
}

export default function SettingModal(props: Props) {
  const { settings, setSettings, pMode, setPMode, onClose } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : parseFloat(value),
    });
  };

  const handleSave = () => {
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 99999,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "linear-gradient(145deg, #1a1a2e 0%, #16162a 100%)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 20,
          padding: "28px 32px",
          width: 360,
          maxWidth: "90vw",
          boxShadow: "0 24px 48px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.03)",
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
          color: "#e4e4e7",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Settings</h2>
          </div>
          <button
            onClick={onClose}
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

        {/* Pressure Mode */}
        <div style={{ marginBottom: 20 }}>
          <label style={{
            display: "block",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase" as const,
            color: "rgba(255, 255, 255, 0.4)",
            marginBottom: 8,
          }}>
            Pressure Mode
          </label>
          <select
            name="pMode"
            value={pMode}
            onChange={(e) => setPMode(e.target.value as "average" | "grouping")}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid rgba(255, 255, 255, 0.1)",
              background: "rgba(255, 255, 255, 0.05)",
              color: "#e4e4e7",
              fontSize: 13,
              fontWeight: 500,
              outline: "none",
              cursor: "pointer",
              appearance: "none" as const,
              WebkitAppearance: "none" as any,
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px center",
            }}
          >
            <option value="average" style={{ background: "#1a1a2e" }}>Average</option>
            <option value="grouping" style={{ background: "#1a1a2e" }}>Grouping</option>
          </select>
        </div>

        {/* Enclose Gesture Toggle */}
        <div style={{
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 14px",
          borderRadius: 10,
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
        }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255, 255, 255, 0.75)" }}>
            Enclose Gesture
          </span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              name="availableEnclosed"
              checked={settings.availableEnclosed}
              onChange={handleChange}
            />
            <span className="toggle-slider" />
          </label>
        </div>

        {/* Max Delete Stroke Num */}
        <div style={{ marginBottom: 24 }}>
          <label style={{
            display: "block",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase" as const,
            color: "rgba(255, 255, 255, 0.4)",
            marginBottom: 8,
          }}>
            Max Delete Strokes
          </label>
          <input
            type="number"
            name="maxDeleteStrokeNum"
            value={settings.maxDeleteStrokeNum}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid rgba(255, 255, 255, 0.1)",
              background: "rgba(255, 255, 255, 0.05)",
              color: "#e4e4e7",
              fontSize: 13,
              fontWeight: 500,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          style={{
            width: "100%",
            padding: "10px 0",
            borderRadius: 10,
            border: "none",
            background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 12px rgba(139, 92, 246, 0.25)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(139, 92, 246, 0.4)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(139, 92, 246, 0.25)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
