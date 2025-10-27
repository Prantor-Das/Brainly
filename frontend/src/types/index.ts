// Shared type definitions for the application

export interface ContentItem {
  _id?: string;
  contentType: "Youtube" | "Notion" | "Twitter";
  tag:
    | "Productivity"
    | "Tech & Tools"
    | "Mindset"
    | "Learning & Skills"
    | "Workflows"
    | "Inspiration";
  title: string;
  link: string;
  type?: string;
  tags?: string[];
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ContentType = "Youtube" | "Notion" | "Twitter";
export type TagType = 
  | "Productivity"
  | "Tech & Tools"
  | "Mindset"
  | "Learning & Skills"
  | "Workflows"
  | "Inspiration";