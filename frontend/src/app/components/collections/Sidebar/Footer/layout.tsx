import { Lang } from "@/app/components/common/lang";

interface Props {
  lang: string | string[] | undefined;
  items: {
    name: string;
    jaName: string;
    icon: JSX.Element;
  }[];
  selectedMenu: "Notebooks" | "Setting" | "Help";
  setSelectedMenu: React.Dispatch<
    React.SetStateAction<"Notebooks" | "Setting" | "Help">
  >;
}

export default function SidebarFooter(props: Props) {
  const { lang, items, selectedMenu, setSelectedMenu } = props;
  const l =
    lang === undefined || Array.isArray(lang) ? new Lang() : new Lang(lang);
  return (
    <div className="sidebar-footer fixed bottom-0 left-0 flex items-center justify-around mb-2">
      {items.map((item) => {
        return (
          <div
            key={item.name}
            className={`sidebar-footer-item ml-1 mr-1 ${
              selectedMenu === item.name ? "sidebar-footer-item--selected" : ""
            }`}
            onClick={() =>
              setSelectedMenu(item.name as "Notebooks" | "Setting" | "Help")
            }
          >
            <button
              className={`${
                selectedMenu === item.name ? "text-sky-500" : "text-gray-400"
              } sidebar-footer-item--button flex items-center justify-center`}
            >
              <div className="sidebar-footer-item--icon mr-1">{item.icon}</div>
              <p className="text-xs">
                {l.nowLang() === "en" ? item.name : item.jaName}
              </p>
            </button>
          </div>
        );
      })}
    </div>
  );
}
