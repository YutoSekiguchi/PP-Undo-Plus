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
import { deleteCollection, getCollectionsByUserID } from "@/app/lib/collection";
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
      name: "Notebooks",
      jaName: "ノートブック",
      icon: <NoteBooksIcon />,
    },
    {
      name: "Setting",
      jaName: "設定",
      icon: <SettingIcon />,
    },
    {
      name: "Help",
      jaName: "ヘルプ",
      icon: <HelpIcon />,
    },
  ];
  const [selectedMenu, setSelectedMenu] = useState<
    "Notebooks" | "Setting" | "Help"
  >("Notebooks");
  const [isSelectMode, setIsSelectMode] = useState<boolean>(false);
  const [selectedCollectionIDs, setSelectedCollectionIDs] = useState<number[]>(
    []
  );

  const fetchCollectionsByUserID = async (userID: number) => {
    const res = await getCollectionsByUserID(userID);
    if (res === null) return;
    setCollections(res);
    selectCollection(res[0]);
  };

  const deleteSelectedNoteCollections = async () => {
    if (selectedCollectionIDs.length === 0 || user === null) return;
    const canDelete = confirm(
      lang === "en"
        ? "Are you sure you want to delete the selected collections?"
        : "選択したコレクションを削除してもよろしいですか？"
    );
    if (!canDelete) return;

    for (let i = 0; i < selectedCollectionIDs.length; i++) {
      const res = await deleteCollection(selectedCollectionIDs[i]);
      if (res === null) {
        if (lang === "en") {
          alert("Failed to delete collection");
        } else {
          alert("コレクションの削除に失敗しました");
        }
        return;
      }
    }
    fetchCollectionsByUserID(Number(user.ID));
    setIsSelectMode(false);
  };

  const handleCollectionClick = (collection: TLCollectionData) => {
    if (isSelectMode) {
      if (selectedCollectionIDs.includes(collection.ID)) {
        setSelectedCollectionIDs(
          selectedCollectionIDs.filter((id) => id !== collection.ID)
        );
      } else {
        setSelectedCollectionIDs([...selectedCollectionIDs, collection.ID]);
      }
    } else {
      selectCollection(collection);
    }
  };

  useEffect(() => {
    if (user === null) return;
    fetchCollectionsByUserID(Number(user.ID));
  }, [user]);

  const CollectionList = () => {
    return (
      <>
        <div className="sidebar-body--collection-list-title">
          <p className="text-md font-bold">
            {lang === "en" ? "My Collections" : "マイコレクション"}
          </p>
        </div>
        {collections.map((collection, i) => (
          <div
            key={i}
            className={`sidebar-body--collection flex items-center pl-1 pr-2 py-2 cursor-pointer rounded-lg ${
              selectedCollection?.ID === collection.ID ? "bg-sky-100" : ""
            }`}
            onClick={() => handleCollectionClick(collection)}
          >
            {isSelectMode && (
              <div className="sidebar-body--collection-selected-icon mr-2">
                {selectedCollectionIDs.includes(collection.ID) ? (
                  <div className="flex items-center justify-center w-4 h-4 rounded-full bg-sky-500 border border-sky-500">
                    <p className="text-white text-xs">✓</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-4 h-4 rounded-full border border-gray-400"></div>
                )}
              </div>
            )}
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
      </>
    );
  };

  const HelpBody = () => {
    return (
      <div className="sidebar-body--help">
        <div className="sidebar-body--help-app-name">
          <p className="text-md font-bold mr-2">PP-Undo Plus</p>
          <p className="text-gray-400 text-xs">
            {lang == "en" ? "version" : "バージョン"}
            {process.env.VERSION}
          </p>
        </div>

        <div className="sidebar-body--help-support mt-8 rounded-lg">
          <p className="text-sm font-bold">{lang=="en"? "Support": "サポート"}</p>
          <p className="text-xs text-gray-400">
            {lang == "en"
              ? "For support, please visit:"
              : "サポートが必要な場合は、以下をご覧ください"}
            <br />
            <a href="" className="text-sky-500"> 
              {lang == "en" ?
              "Preparing"
              : "準備中"}
            </a>
          </p>
        </div>

        <div className="sidebar-body--help-terms mt-4 rounded-lg">
          <p className="text-xs text-gray-400">
            <a href={`${lang==="en"? "/terms?lang=en": "/terms"}`} className="text-sky-500">
              {lang == "en" ? "Terms of Service" : "利用規約"}
            </a>{" "}
            |
            <a href={`${lang==="en"? "/privacy-policy?lang=en": "/privacy-policy"}`} className="text-sky-500">
              {lang == "en" ? "Privacy Policy" : "プライバシーポリシー"}
            </a>
          </p>
        </div>

        <div className="sidebar-body--help-contact mt-4 rounded-lg">
          <p className="text-md font-bold">
            {lang == "en" ? "Contact" : "お問い合わせ"}
          </p>
          <p className="text-xs text-gray-400">
            {lang == "en"
              ? "For inquiries, email us at:"
              : "お問い合わせは、以下までご連絡ください"}
            <br />
            <a href="mailto:yuutosekiguchi@gmail.com" className="text-sky-500">
              yuutosekiguchi@gmail.com
            </a>
          </p>
        </div>
        <div className="sidebar-body--help-copy-right mt-12">
          <p className="text-xs text-gray-400">
            &copy;2023-<span id="copy-year">{new Date().getFullYear()}</span>{" "}
            Yuto Sekiguchi. All rights reserved.
          </p>
        </div>
      </div>
    );
  };

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
            isSelectMode={isSelectMode}
            setIsSelectMode={setIsSelectMode}
          />
          <div className="sidebar-body w-full">
            <div className="slidebar-body--title">
              <p className="ml-4 font-bold text-2xl mb-2">
                {lang === "en"
                  ? selectedMenu
                  : items.find((item) => item.name === selectedMenu)?.jaName}
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
              {selectedMenu === "Notebooks" && <CollectionList />}
              {selectedMenu === "Setting" && <></>}
              {selectedMenu === "Help" && <HelpBody />}
            </div>
            {isSelectMode && selectedCollectionIDs.length > 0 && (
              <div className="flex items-center justify-around mb-2 mt-4">
                <div className="ml-1 mr-1">
                  <button
                    className="flex items-center justify-center px-4 py-2 bg-red-500 hover:bg-red-400 rounded-lg"
                    onClick={deleteSelectedNoteCollections}
                  >
                    <p className="text-xs text-white">
                      {lang === "en" ? "Delete" : "削除"}
                    </p>
                  </button>
                </div>
              </div>
            )}
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
