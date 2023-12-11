"use client";

import { NoteBookIcon } from "@/icons/NoteBook";
import "./style.css";
import { useState } from "react";
import { NoteBooksIcon } from "@/icons/NoteBooks";
import { SettingIcon } from "@/icons/Setting";
import { HelpIcon } from "@/icons/Help";
import SidebarFooter from "./Footer/layout";
import SidebarHeader from "./Header/layout";

interface Props {
  lang: string | string[] | undefined;
}

export default function Sidebar(props: Props) {
  const { lang } = props;
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
  const [selectedMenu, setSelectedMenu] = useState<"notebooks" | "setting" | "help">("notebooks");
  return (
    <div className="sidebar">
      <SidebarHeader />
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
        <div className="sidebar-body--collection-list ml-4 mt-6">
          <div className="sidebar-body--collection-list-title">
            <p className="text-md font-bold">
              {lang === "en" ? "My Collections" : "マイコレクション"}
            </p>
          </div>
          {
            <div className="sidebar-body--collection flex items-center pl-1 pr-4 py-2 cursor-pointer">
              <div className="sidebar-body--collection-note-icon text-sky-500 mr-2">
                <NoteBookIcon />
              </div>
              <div className="sidebar-body--collection-description">
                <div className="sidebar-body--collection-name text-overflow">
                  <p className="text-xs">ノートブック</p>
                </div>
                <div className="sidebar-body--collection-date">
                  <p className="text-gray-400">2023/01/01 12:00</p>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
      <SidebarFooter
        items={items}
        selectedMenu={selectedMenu}
        setSelectedMenu={setSelectedMenu}
        lang={lang}
      />
    </div>
  );
}
