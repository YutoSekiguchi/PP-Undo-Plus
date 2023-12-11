import { MenuDotIcon } from "@/icons/MenuDot";
import { PlusIcon } from "@/icons/Plus";

export default function SidebarHeader() {
  return (
    <div className="sidebar-header w-full h-12">
      <div className="sidebar-header--title flex items-center justify-end mt-6 text-sky-500">
        <div className="sidebar-header--add-icon mr-4">
          <PlusIcon />
        </div>
        <div className="sidebar-header--menu-icon mr-2">
          <MenuDotIcon />
        </div>
      </div>
    </div>
  );
}