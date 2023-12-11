interface Props {
  lang: string | string[] | undefined;
  items: {
    name: string;
    jaName: string;
    icon: JSX.Element;
  }[];
  selectedMenu: "notebooks" | "setting" | "help";
  setSelectedMenu: React.Dispatch<React.SetStateAction<"notebooks" | "setting" | "help">>;
}

export default function SidebarFooter(props: Props) {
  const { lang, items, selectedMenu, setSelectedMenu } = props;
  return(
    <div className="sidebar-footer w-full fixed bottom-0 left-0 flex items-center mb-2">
      {
        items.map((item) => {
          return (
            <div
              key={item.name}
              className={`sidebar-footer-item ml-2 ${selectedMenu === item.name ? "sidebar-footer-item--selected" : ""}`}
              onClick={() => setSelectedMenu(item.name as "notebooks" | "setting" | "help")}
            >
              <button className={`${selectedMenu === item.name ? "text-sky-500": "text-gray-400"} sidebar-footer-item--button flex items-center justify-center`}>
                <div className="sidebar-footer-item--icon mr-1">{item.icon}</div>
                <p className="text-xs">{lang === "en" ? item.name : item.jaName}</p>
              </button>
            </div>
          )
        })
      }
    </div>
  );
}