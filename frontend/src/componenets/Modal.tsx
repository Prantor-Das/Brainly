import axios from "axios";
import { useRef, useState } from "react";
import type { ContentType, TagType } from "../types";
// import { useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";

const Modal = (props: {
  onClick: () => void;
  setModal: (value: boolean) => void;
  setReloadData: () => void;
}) => {
  //   const navigate = useNavigate();

  const modalRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const [tag, setTag] = useState<TagType>("Productivity");
  const [category, setCategory] = useState<ContentType>("Youtube");
  const mapTags: readonly TagType[] = [
    "Productivity",
    "Tech & Tools",
    "Mindset",
    "Learning & Skills",
    "Workflows",
    "Inspiration",
  ] as const;

  const submitData = async () => {
    props.setModal(false);
    if (
      linkRef.current?.value.trim() === "" ||
      titleRef.current?.value.trim() === ""
    ) {
      alert("Fill all the input fields");
      return;
    }

    const data = {
      link: linkRef.current?.value || "",
      contentType: category,
      title: titleRef.current?.value || "",
      tag,
    };
    try {
      //   const token = Cookies.get("token");
      //   if (!token) {
      //     alert("Please log in first");
      //     navigate("/");
      //     return;
      //   }

      //   await fetch("http://localhost:3000/api/v1/addcontent", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //       token: token,
      //     },
      //     credentials: "include",
      //     body: JSON.stringify(data),
      //   });

      await axios.post("http://localhost:3000/api/v1/addcontent", data, {
        withCredentials: true,
      });

      props.setReloadData();
      alert("content added");
    } catch (err) {
      console.error("Error while sending data", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        onClick={props.onClick}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      ></div>
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Add Content</h2>
          <button
            onClick={props.onClick}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">

          {/* Input fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                ref={titleRef}
                type="text"
                placeholder="Enter content title"
                maxLength={50}
                className="input-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Link</label>
              <input
                ref={linkRef}
                type="url"
                required
                placeholder="https://example.com"
                className="input-base"
              />
            </div>
          </div>

          {/* Tag Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Choose Tag</label>
            <div className="flex flex-wrap gap-2">
              {mapTags.map((t) =>
                tag === t ? (
                  <ModalTag2 key={t} tag={t} onClick={() => setTag(t)} />
                ) : (
                  <ModalTag1 key={t} tag={t} onClick={() => setTag(t)} />
                ),
              )}
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Choose Category</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setCategory("Youtube")}
                className={`px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  category === "Youtube"
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                YouTube
              </button>
              <button
                onClick={() => setCategory("Twitter")}
                className={`px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  category === "Twitter"
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Twitter
              </button>
              <button
                onClick={() => setCategory("Notion")}
                className={`px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  category === "Notion"
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Notion
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex gap-3 justify-end">
            <button
              onClick={props.onClick}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={submitData}
              className="btn-base btn-primary px-6 py-2 text-sm font-medium"
            >
              Add Content
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CardProps {
  tag: TagType;
  onClick: () => void;
}

const ModalTag1 = (props: CardProps) => {
  return (
    <button
      onClick={props.onClick}
      className="px-3 py-2 text-xs font-medium bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
    >
      {props.tag}
    </button>
  );
};

const ModalTag2 = (props: CardProps) => {
  return (
    <button
      onClick={props.onClick}
      className="px-3 py-2 text-xs font-medium bg-blue-500 text-white rounded-full shadow-sm hover:bg-blue-600 transition-colors"
    >
      {props.tag}
    </button>
  );
};

export default Modal;
