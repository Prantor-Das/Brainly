import mongoose, { Schema } from "mongoose";

const contentTypes = ["image", "video", "article", "audio"];

const ContentSchema = new Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  type: { type: String, enum: contentTypes, required: true },
  tags: [{ type: mongoose.Types.ObjectId, ref: "Tag" }],
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  embedding: { type: [Number], index: "2dsphere" },
});

export const Content = mongoose.model("Content", ContentSchema);
