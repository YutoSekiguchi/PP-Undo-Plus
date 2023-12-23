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
}

export default function LogList(props: Props) {
  const { editorUtils, id, width, height, background, handleClose, isDemo } = props;

  const [logs, setLogs] = useState<TLNoteLogData[]>([]);

  const handleCloseDialog = () => {
    handleClose();
  }

  const handleClickLog = (log: TLNoteLogData) => () => {
    const snapshot = log.Snapshot;
      if (snapshot === "" || snapshot === null) return;
      editorUtils.loadSnapshot(JSON.parse(snapshot));
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) =>  {
    e.currentTarget.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  }

  useEffect(() => {
    const getLogs = async() => {
      if (isDemo) return;
      const res = await getNoteLogsByNoteID(id);
      if (res === null) return;
      setLogs(res)
    }

    getLogs();
  }
, []);

  return (
    <div className="main fixed bg-gray-400" style={{ top: 0, right: 0, width: width, height: height, background: background, zIndex: 999 }}>
      <div className="title flex justify-between items-center">
        <div className="outer" onClick={handleCloseDialog}>
          <div className="inner">
            <label>Back</label>
          </div>
        </div>
        <div className="text-center grow font-bold text-md my-4 mr-12">
          History List
        </div>
      </div>
      {
        isDemo && 
        <div className="text-center text-sm text-gray-400 my-4">
          This function is not available in demo mode.
        </div>
      }
      <div className="loglist flex flex-col items-center pb-24">
        {
          logs.map((log: TLNoteLogData, i: number) => {
            return (
              <div key={i} className="text-xs mx-auto">
                <div className="loglist-item-img mb-2" onClick={handleClickLog(log)}>
                  {
                    log.SvgPath !== "" &&
                    <img src={"/svgs/" + log.SvgPath + ".svg"} className="log-img hover:opacity-50 hover:bg-gray-200 text-center mx-auto" onError={handleImageError} />
                  }
                </div>
                <div className="notelist-main-item-date text-gray-400 text-center cursor-default">
                  {formatDate(log.UpdatedAt)}
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  );
}