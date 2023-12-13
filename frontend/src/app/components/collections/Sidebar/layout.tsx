"use client";

import { NoteBookIcon } from "@/icons/NoteBook";
import "./style.css";
import { useEffect, useState } from "react";
import { NoteBooksIcon } from "@/icons/NoteBooks";
import { SettingIcon } from "@/icons/Setting";
import { HelpIcon } from "@/icons/Help";
import SidebarFooter from "./Footer/layout";
import SidebarHeader from "./Header/layout";
import { useSelectedCollection, useUser } from "@/app/hooks";
import { TLCollectionData } from "@/@types/collection";
import { getCollectionsByUserID } from "@/app/lib/collection";
import { formatDate } from "@/app/modules/common/formatDate";

interface Props {
  lang: string | string[] | undefined;
}

export default function Sidebar(props: Props) {
  const { lang } = props;
  const { user } = useUser();
  const [collections, setCollections] = useState<TLCollectionData[]>([]);
  const { selectedCollection, selectCollection } = useSelectedCollection();
  const items = [
    {
      name: "notebooks",
      jaName: "ノートブック",
      icon: <NoteBooksIcon />,
    },
    {
      name: "setting",
      jaName: "設定",
      icon: <SettingIcon />,
    },
    {
      name: "help",
      jaName: "ヘルプ",
      icon: <HelpIcon />,
    },
  ];
  const [selectedMenu, setSelectedMenu] = useState<
    "notebooks" | "setting" | "help"
  >("notebooks");

  const fetchCollectionsByUserID = async (userID: number) => {
    const res = await getCollectionsByUserID(userID);
    if (res === null) return;
    setCollections(res);
    selectCollection(res[0]);
  };

  const handleCollectionClick = (collection: TLCollectionData) => {
    selectCollection(collection);
  };

  useEffect(() => {
    if (user === null) return;
    fetchCollectionsByUserID(Number(user.ID));
  }, [user]);

  return (
    <div className="sidebar">
      {user && (
        <>
          <SidebarHeader
            lang={lang}
            userID={Number(user.ID)}
            fetchCollectionsByUserID={() =>
              fetchCollectionsByUserID(Number(user.ID))
            }
          />
          <div className="sidebar-body w-full">
            <div className="slidebar-body--title">
              <p className="ml-4 font-bold text-2xl mb-2">
                {lang === "en" ? "Note Books" : "ノートブック"}
              </p>
            </div>
            <div className="sidebar-body--logo mt-4 mb-8">
              <img
                src="/sidebar-logo.png"
                alt="logo"
                className="w-24 h-18 mx-auto opacity-90"
              />
            </div>
            <div className="sidebar-body--collection-list ml-4 mt-6 mr-2">
              <div className="sidebar-body--collection-list-title">
                <p className="text-md font-bold">
                  {lang === "en" ? "My Collections" : "マイコレクション"}
                </p>
              </div>
              {collections.map((collection, i) => (
                <div
                  key={i}
                  className={`sidebar-body--collection flex items-center pl-1 pr-2 py-2 cursor-pointer rounded-lg ${
                    selectedCollection?.ID === collection.ID
                      ? "bg-sky-100"
                      : ""
                  }`}
                  onClick={() => handleCollectionClick(collection)}
                >
                  <div className="sidebar-body--collection-note-icon text-sky-500 mr-2">
                    <NoteBookIcon />
                  </div>
                  <div className="sidebar-body--collection-description">
                    <div className="sidebar-body--collection-name text-overflow">
                      <p className="text-xs">{collection.Title}</p>
                    </div>
                    <div className="sidebar-body--collection-date">
                      <p className="text-gray-400">
                        {formatDate(collection.UpdatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <SidebarFooter
            items={items}
            selectedMenu={selectedMenu}
            setSelectedMenu={setSelectedMenu}
            lang={lang}
          />
        </>
      )}
    </div>
  );
}
