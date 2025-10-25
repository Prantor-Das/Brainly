import type { Request, Response } from "express";
import { extractPageText } from "../utils/scrapeText.js";
import { generateEmbedding } from "../utils/embedText.js";
import { pineconeIndex } from "../utils/pineconeClient.js";
import { Content } from "../models/content.models.js";
import { Tag } from "../models/tag.models.js";
import { contentSchema, updateContentSchema } from "../validations/content.js";

// Add content
export const addContent = async (req: Request, res: Response) => {
  try {
    const { title, link, type, tags } = contentSchema.parse(req.body);
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // Scrape page text
    const pageText = await extractPageText(link);

    // Generate embedding via Hugging Face
    const embedding = await generateEmbedding(`${title}. ${pageText}`);

    // Upsert or create tags
    const tagIds = await Promise.all(
      tags.map(async (tagTitle: string) => {
        const tag = await Tag.findOneAndUpdate(
          { title: tagTitle },
          { title: tagTitle },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        return tag._id;
      })
    );

    // Save content to MongoDB
    const content = await Content.create({
      title,
      link,
      type,
      tags: tagIds,
      userId,
      embedding,
    });

    // Populate user and tags
    const contentToSend = await Content.findById(content._id)
      .select("-embedding")
      .populate("userId", "username")
      .populate("tags", "title");

    // Save vector to Pinecone
    await pineconeIndex.upsert([
      {
        id: content._id.toString(),
        values: embedding,
        metadata: { userId, title, link, type },
      },
    ]);

    res
      .status(201)
      .json({ message: "Content saved successfully", contentToSend });
  } catch (err) {
    console.error("Error adding content:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all content for a user
export const getContent = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const contents = await Content.find({ userId })
      .select("-embedding")
      .populate("userId", "username");

    res.status(200).json(contents);
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update existing content
export const updateContent = async (req: Request, res: Response) => {
  try {
    const { contentId, title, link, type, tags } = updateContentSchema.parse(
      req.body
    );
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const content = await Content.findOne({ _id: contentId, userId });
    if (!content)
      return res
        .status(404)
        .json({ message: "Content not found or unauthorized" });

    // Keep old embedding unless link or title changes
    let embedding: number[] = Array.isArray(content.embedding)
      ? (content.embedding as number[])
      : [];

    if (link !== content.link || title !== content.title) {
      try {
        const pageText = await extractPageText(link);
        embedding = await generateEmbedding(`${title}. ${pageText}`);
      } catch (err) {
        console.warn("Embedding generation failed:", err);
      }
    }

    // Upsert tags
    const tagOps = tags.map((tag: string) => ({
      updateOne: {
        filter: { title: tag },
        update: { $setOnInsert: { title: tag } },
        upsert: true,
      },
    }));
    await Tag.bulkWrite(tagOps);

    const tagDocs = await Tag.find({ title: { $in: tags } });
    const tagIds = tagDocs.map((t) => t._id);

    // Update MongoDB record
    const updated = await Content.findByIdAndUpdate(
      contentId,
      { title, link, type, tags: tagIds, embedding },
      { new: true }
    )
      .select("-embedding")
      .populate("userId", "username")
      .populate("tags", "title");

    // Update vector in Pinecone
    await pineconeIndex.update({
      id: content._id.toString(),
      values: embedding,
      metadata: { userId, title, link, type },
    });

    res.status(200).json({ message: "Content updated", content: updated });
  } catch (error) {
    console.error("Error updating content:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete content

export const deleteContent = async (req: Request, res: Response) => {
  try {
    const { contentId } = req.body;
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const content = await Content.findOne({ _id: contentId, userId });
    if (!content)
      return res
        .status(404)
        .json({ message: "Content not found or unauthorized" });

    const tagIds = content.tags;

    // Delete the content
    await Content.deleteOne({ _id: contentId });

    // Remove unused tags
    const unusedTags: string[] = [];
    for (const tagId of tagIds) {
      const usedElsewhere = await Content.exists({ tags: tagId });
      if (!usedElsewhere) unusedTags.push(tagId.toString());
    }

    if (unusedTags.length > 0) {
      await Tag.deleteMany({ _id: { $in: unusedTags } });
    }

    // Delete vector from Pinecone
    await pineconeIndex.deleteOne(contentId.toString());

    res
      .status(200)
      .json({ message: "Content and unused tags deleted successfully" });
  } catch (error) {
    console.error("Error deleting content:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
