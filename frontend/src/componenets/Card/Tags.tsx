import type { TagType } from "../../types";

interface TagsProps {
  tagTypes: TagType;
}

const Tags = (props: TagsProps) => {
  const getTagColor = (tag: string) => {
    const colors = {
      "Productivity": "bg-gradient-to-r from-green-500 to-emerald-500",
      "Tech & Tools": "bg-gradient-to-r from-blue-500 to-cyan-500", 
      "Mindset": "bg-gradient-to-r from-purple-500 to-pink-500",
      "Learning & Skills": "bg-gradient-to-r from-orange-500 to-red-500",
      "Workflows": "bg-gradient-to-r from-indigo-500 to-purple-500",
      "Inspiration": "bg-gradient-to-r from-yellow-500 to-orange-500"
    };
    return colors[tag as keyof typeof colors] || "bg-gradient-to-r from-gray-500 to-gray-600";
  };

  return (
    <span className={`inline-flex items-center px-3 py-1.5 text-xs font-medium text-white rounded-full ${getTagColor(props.tagTypes)} shadow-sm`}>
      #{props.tagTypes}
    </span>
  );
};

export default Tags;
