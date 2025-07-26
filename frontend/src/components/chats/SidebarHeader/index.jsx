import { Settings } from "lucide-react";
import { DropDown } from "../../ui";

const STYLES = {
  header: {
    container: "h-16 flex justify-between items-center px-6 border-b-[1px] border-b-gray border-r-[1px] border-r-gray",
    title: "text-2xl",
    actions: "flex gap-2"
  },
};

const SidebarHeader = ({ onLogout }) => (
  <div className={STYLES.header.container}>
    <div className={STYLES.header.title}>
      Chatly
    </div>
    <div className={STYLES.header.actions}>
      <DropDown>
        <DropDown.Trigger>
          <Settings />
        </DropDown.Trigger>
        <DropDown.Content>
          <DropDown.Item onClick={onLogout}>
            Logout
          </DropDown.Item>
        </DropDown.Content>
      </DropDown>
    </div>
  </div>
);

export default SidebarHeader;