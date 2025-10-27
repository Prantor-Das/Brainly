// import axios from "axios";
import Tags from "./Tags";
import { format } from "date-fns";
import { type JSX, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import NotionIcon from "../../icons/NotionIcon";
import TwitterIcon from "../../icons/XIcon";
import DocumentIcon from "../../icons/DocumentIcon";
import DeleteIcon from "../../icons/DeleteIcon";
import type { ContentType, TagType } from "../../types";

interface CardProps {
  icon: ContentType;
  tag: TagType;
  title: string;
  link: string;
  reload?: () => void;
}

export const Card = (props: CardProps) => {
  // const navigate = useNavigate();
  const date = format(new Date(), "dd MMM yyyy");
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  // --- Helper: Extract YouTube Video ID ---
  const getYoutubeId = (url: string): string | null => {
    const regularFormat = url.split("v=");
    if (regularFormat.length > 1) {
      return regularFormat[1].split("&")[0];
    }

    const shortFormat = url.split("youtu.be/");
    if (shortFormat.length > 1) {
      return shortFormat[1].split("?")[0];
    }

    return null;
  };

  // --- Determine Content Preview ---
  let contentPreview: JSX.Element = (
    <p className="text-gray-500">No content available</p>
  );

  if (props.icon === "Youtube") {
    contentPreview = thumbnail ? (
      <img
        src={thumbnail}
        alt={props.title}
        className="w-full h-full object-cover rounded-md hover:scale-105 transition-transform duration-200"
      />
    ) : (
      <div className="flex flex-col items-center justify-center text-gray-400">
        <svg className="w-12 h-12 mb-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
        <span className="text-sm">YouTube Video</span>
      </div>
    );
  } else if (props.icon === "Twitter") {
    contentPreview = (
      <div className="flex flex-col items-center justify-center text-gray-400">
        <TwitterIcon />
        <span className="text-sm mt-2">Twitter Post</span>
      </div>
    );
  } else if (props.icon === "Notion") {
    contentPreview = (
      <div className="flex flex-col items-center justify-center text-gray-400">
        <NotionIcon />
        <span className="text-sm mt-2">Notion Page</span>
      </div>
    );
  }

  // --- Fetch YouTube Thumbnail ---
  useEffect(() => {
    const videoId = getYoutubeId(props.link);
    if (videoId) {
      setThumbnail(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
    } else {
      setThumbnail(null);
    }
  }, [props.link]);

  // --- Delete Handler (Using Axios) ---
  async function deleteHandle() {
    // try {
    //   const token = localStorage.getItem("token");
    //   if (!token) {
    //     alert("Please log in first");
    //     navigate("/");
    //     return;
    //   }

    //   await axios.delete(`http://localhost:3000/api/v1/delete/${props.title}`, {
    //     headers: { token },
    //     withCredentials: true,
    //   });

    //   alert("Item deleted successfully");
    //   props.reload?.();
    // } catch (error) {
    //   console.error("Item not deleted:", error);
    //   alert("Failed to delete item");
    // }
  }

  // --- Render ---
  return (
    <article className="card-base p-6 max-w-sm w-full group">
      {/* Header Section */}
      <header className="flex justify-between items-start mb-4 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="shrink-0 w-8 h-8 flex items-center justify-center text-blue-600">
            <DocumentIcon />
          </div>
          <h3 className="font-semibold text-gray-800 text-lg leading-tight truncate group-hover:text-blue-600 transition-colors">
            {props.title}
          </h3>
        </div>

        <button
          onClick={deleteHandle}
          className="shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
          aria-label="Delete content"
        >
          <DeleteIcon />
        </button>
      </header>

      {/* Content Preview */}
      <div className="mb-4 min-h-[120px] flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
        {contentPreview}
      </div>

      {/* Tags Section */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Tags tagTypes={props.tag} />
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-between text-sm text-gray-500">
        <span>Created: {date}</span>
        <a 
          href={props.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
        >
          View →
        </a>
      </footer>
    </article>
  );
};
