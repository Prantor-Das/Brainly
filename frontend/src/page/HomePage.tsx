import { useEffect, useState, type JSX } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card } from "../componenets/Card/Card";
import { ShareIcon } from "../icons/ShareIcon";
import { PlusIcon } from "../icons/PlusIcon";
import { ButtonUI } from "../componenets/Button";
import Modal from "../componenets/Modal";
import SideNavbar from "../componenets/Sidebar/Sidebar";
import MobileSidebar from "../componenets/MobileSidebar";
import type { ContentItem } from "../types";

const HomePage = () => {
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [reloadData, setReloadData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data1, setData] = useState<ContentItem[]>([]);
  const [ytData, setYTData] = useState<ContentItem[]>([]);
  const [notionData, setNitionData] = useState<ContentItem[]>([]);
  const [dataShow, setDataShow] = useState("All");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ---- Fetch Data (with Axios) ----
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in first");
        navigate("/");
        return;
      }

      const response = await axios.get("http://localhost:5000/api/v1/content", {
        headers: { token },
        withCredentials: true,
      });

      setData(response.data.data || []);
    } catch (err) {
      console.error("Error while fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [reloadData, navigate]);

  // ---- Handle Share Functionality ----
  async function handleShare() {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        alert("Please log in first");
        navigate("/");
        return;
      }

      const response = await axios.get("http://localhost:5000/api/v1/content", {
        headers: { token },
        withCredentials: true,
      });

      const sharedItems = response.data.data || [];

      const encodedData = encodeURIComponent(JSON.stringify(sharedItems));
      const shareLink = `http://localhost:5173/share/${userId}?data=${encodedData}`;
      await navigator.clipboard.writeText(shareLink);
      alert("Shareable link copied to clipboard!");
    } catch (err) {
      console.error("Error while sharing:", err);
      alert("Failed to generate or copy the share link.");
    }
  }

  // ---- Data Filter and Display Logic ----
  const renderCards = (dataArray: ContentItem[]) => {
    if (loading) {
      return (
        <div className="col-span-full flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-600">Loading your content...</p>
          </div>
        </div>
      );
    }
    if (dataArray.length === 0) {
      return (
        <div className="text-xl font-semibold text-gray-600">
          You don’t have any content yet.
        </div>
      );
    }
    return dataArray.map((item, idx) => (
      <Card
        key={idx}
        icon={item.contentType}
        tag={item.tag}
        title={item.title}
        link={item.link}
        reload={() => setReloadData(!reloadData)}
      />
    ));
  };

  let show: JSX.Element | JSX.Element[] = <></>;
  if (dataShow === "All") show = renderCards(data1);
  else if (dataShow === "Youtube") show = renderCards(ytData);
  else show = renderCards(notionData);

  // ---- UI Layout ----
  return (
    <div className="flex min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <SideNavbar
          setData={setData}
          setYTData={setYTData}
          setNitionData={setNitionData}
          data1={data1}
          setDataShow={setDataShow}
        />
      </div>

      {/* Main Section */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header Bar */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <h1 className="font-bold text-2xl sm:text-3xl text-gray-800">
                {dataShow === "All" ? "All Notes" : 
                 dataShow === "Youtube" ? "YouTube Videos" : 
                 "Documents"}
              </h1>
              
              {/* Mobile menu button */}
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <ButtonUI
                variant="secondary"
                size="md"
                text="Share Brain"
                startIcon={<ShareIcon size="md" />}
                onClick={handleShare}
              />
              <ButtonUI
                variant="primary"
                size="md"
                text="Add Content"
                startIcon={<PlusIcon size="md" />}
                onClick={() => setModal(true)}
              />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {show}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        setData={setData}
        setYTData={setYTData}
        setNitionData={setNitionData}
        data1={data1}
        setDataShow={setDataShow}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Modal */}
      {modal && (
        <Modal
          onClick={() => setModal(false)}
          setModal={setModal}
          setReloadData={() => setReloadData(!reloadData)}
        />
      )}
    </div>
  );
};

export default HomePage;
