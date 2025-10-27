
import All from "../icons/All";
import AppLogo from "../icons/AppLogo";
import DocumentIcon from "../icons/DocumentIcon";
import YoutubeIcon from "../icons/YoutubeIcon";
import NavFields from "./Sidebar/NavFields";
import type { ContentItem } from "../types";
import type { Dispatch, SetStateAction } from "react";

interface MobileSidebarProps {
  data1: ContentItem[];
  setData: Dispatch<SetStateAction<ContentItem[]>>;
  setYTData: Dispatch<SetStateAction<ContentItem[]>>;
  setNitionData: Dispatch<SetStateAction<ContentItem[]>>;
  setDataShow: (type: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebar = (props: MobileSidebarProps) => {
  const { data1, setYTData, setNitionData, setDataShow, isOpen, onClose } = props;

  // --- Handlers ---
  const handleAll = () => {
    setDataShow("All");
    onClose();
  };

  const handleYoutube = () => {
    const ytData = data1.filter((item) => item.contentType === "Youtube");
    setYTData(ytData);
    setDataShow("Youtube");
    onClose();
  };

  const handleDocuments = () => {
    const ntData = data1.filter(
      (item) => item.contentType === "Notion" || item.contentType === "Twitter"
    );
    setNitionData(ntData);
    setDataShow("Notion");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <AppLogo />
            <span className="text-xl font-bold text-gray-800">Second Brain</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
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
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100">
          <div className="text-sm text-gray-500 text-center">
            <p>Total items: {data1.length}</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default MobileSidebar;