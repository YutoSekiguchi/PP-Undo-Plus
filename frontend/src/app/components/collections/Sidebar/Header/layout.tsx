import { MenuDotIcon } from "@/icons/MenuDot";
import { PlusIcon } from "@/icons/Plus";
import { useState } from "react";
import NewCollectionDialog from "../../NewCollectionDialog/layout";

interface Props {
  lang: string | string[] | undefined;
  userID: number;
  fetchCollectionsByUserID: () => void;
  isSelectMode: boolean;
  setIsSelectMode: (isSelectMode: boolean) => void;
}

export default function SidebarHeader(props: Props) {
  const { lang, userID, fetchCollectionsByUserID, isSelectMode, setIsSelectMode } = props;
  const [showDialog, setShowDialog] = useState(false);

  const handlePlusIconClick = () => {
    setShowDialog(true);
  };

  const handleClose = () => {
    setShowDialog(false);
    fetchCollectionsByUserID();
  }

  return (
    <div className="sidebar-header w-full h-12">
      <div className="sidebar-header--title flex items-center justify-end mt-6 text-sky-500">
        {
          isSelectMode ?
          <>
            <div className="mr-2 text-sm cursor-pointer" onClick={() => {setIsSelectMode(false)}}>
              {lang === "en" ? "Cancel" : "キャンセル"}
            </div>
          </>
          :
          <>
            <div className="sidebar-header--add-icon mr-4 cursor-pointer" onClick={handlePlusIconClick}>
              <PlusIcon />
            </div>
            <div className="sidebar-header--menu-icon mr-2 cursor-pointer" onClick={() => {setIsSelectMode(true)}}>
              <MenuDotIcon />
            </div>
          </>
        }
      </div>
      {showDialog && <NewCollectionDialog lang={lang} onClose={handleClose} userID={userID} />}
    </div>
  );
}