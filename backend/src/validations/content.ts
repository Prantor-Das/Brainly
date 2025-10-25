import {z} from "zod";

export const contentSchema = z.object({
    title: z.string().min(1, { message: "Title cannot be empty" }),
    link: z.string().min(1, { message: "Link cannot be empty" }),
    type: z.string().min(1, { message: "Type cannot be empty" }),
    tags: z.array(z.string()).min(1, { message: "At least one tag is required" }),
});

export const updateContentSchema = z.object({
    contentId: z.string().min(1, { message: "Content ID cannot be empty" }),
    title: z.string().min(1, { message: "Title cannot be empty" }),
    link: z.string().min(1, { message: "Link cannot be empty" }),
    type: z.string().min(1, { message: "Type cannot be empty" }),
    tags: z.array(z.string()).min(1, { message: "At least one tag is required" }),
});