import {z} from "zod";

export const shareLinkSchema = z.object({
    shareLink: z.string().min(1, { message: "Share link is required" }),
});

export const shareSchema = z.object({
    share: z.boolean(),
});