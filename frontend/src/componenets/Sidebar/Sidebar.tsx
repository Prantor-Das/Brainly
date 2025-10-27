import All from "../../icons/All";
import AppLogo from "../../icons/AppLogo";
import DocumentIcon from "../../icons/DocumentIcon";
import YoutubeIcon from "../../icons/YoutubeIcon";
import NavFields from "./NavFields";
import type { ContentItem } from "../../types";
import type { Dispatch, SetStateAction } from "react";

interface SideNavbarProps {
  data1: ContentItem[];
  setData: Dispatch<SetStateAction<ContentItem[]>>;
  setYTData: Dispatch<SetStateAction<ContentItem[]>>;
  setNitionData: Dispatch<SetStateAction<ContentItem[]>>;
  setDataShow: (type: string) => void;
}

const SideNavbar = (props: SideNavbarProps) => {
  const { data1, setYTData, setNitionData, setDataShow } = props;

  // --- Handlers ---
  const handleAll = () => setDataShow("All");

  const handleYoutube = () => {
    const ytData = data1.filter((item) => item.contentType === "Youtube");
    setYTData(ytData);
    setDataShow("Youtube");
  };

  const handleDocuments = () => {
    const ntData = data1.filter(
      (item) => item.contentType === "Notion" || item.contentType === "Twitter"
    );
    setNitionData(ntData);
    setDataShow("Notion");
  };

  return (
    <aside className="w-80 h-screen border-r border-gray-200 bg-white shadow-lg flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-100">
        <AppLogo />
        <span className="text-xl font-bold text-gray-800">Second Brain</span>
      </div>

      {/* Nav Items */}
      <nav className="flex flex-col py-6 px-4 space-y-2">
        <button
          onClick={handleAll}
          className="w-full text-left hover:bg-gray-50 rounded-xl px-4 py-3 transition-all duration-200 group"
        >
          <NavFields text="All" startIcon={<All />} />
        </button>

        <button
          onClick={handleYoutube}
          className="w-full text-left hover:bg-gray-50 rounded-xl px-4 py-3 transition-all duration-200 group"
        >
          <NavFields text="Youtube" startIcon={<YoutubeIcon />} />
        </button>

        <button
          onClick={handleDocuments}
          className="w-full text-left hover:bg-gray-50 rounded-xl px-4 py-3 transition-all duration-200 group"
        >
          <NavFields text="Documents" startIcon={<DocumentIcon />} />
        </button>
      </nav>

      {/* Footer */}
      <div className="mt-auto p-6 border-t border-gray-100">
        <div className="text-sm text-gray-500 text-center">
          <p>Total items: {data1.length}</p>
        </div>
      </div>
    </aside>
  );
};

export default SideNavbar;
