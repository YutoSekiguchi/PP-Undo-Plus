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
    // 保存処理
    onClose();
  };
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      style={{ zIndex: "9999" }}
    >
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h2 className="text-xl mb-1">Settings</h2>
        <div className="mb-4">
          <p className="block text-gray-500">Pen Pressure Mode</p>
          <select
            name="pMode"
            value={pMode}
            onChange={(e) => setPMode(e.target.value as "average" | "grouping")}
            className="w-full p-2 rounded border border-gray-300"
          >
            <option value="average">average</option>
            <option value="grouping">grouping</option>
          </select>
        </div>
        <div className="mb-4">
          <div className="flex items-center">
            <span className="block text-gray-500 mr-2">Allow Enclose Gesture</span>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                name="availableEnclosed"
                checked={settings.availableEnclosed}
                onChange={handleChange}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                style={{ right: settings.availableEnclosed ? "0" : "auto", left: settings.availableEnclosed ? "auto" : "0" }}
              />
              <div className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></div>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
