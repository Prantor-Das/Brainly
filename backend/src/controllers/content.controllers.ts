import type { Request, Response } from "express";
import { Content } from "../models/content.models.js";
import { contentSchema, updateContentSchema } from "../validations/content.js";
import { Tag } from "../models/tag.models.js";

// Create new content
export const addContent = async (req: Request, res: Response) => {
  try {
    const { title, link, type, tags } = contentSchema.parse(req.body);
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Ensure tags are ObjectIds
    const tagIds = await Promise.all(
      tags.map(async (tagTitle: string) => {
        let tag = await Tag.findOne({ title: tagTitle });
        if (!tag) {
          tag = await Tag.create({ title: tagTitle });
        }
        return tag._id;
      })
    );

    const content = await Content.create({
      title,
      link,
      type,
      tags: tagIds,
      userId,
    });

    res.status(201).json({ message: "Content saved successfully", content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all content for a user
export const getContent = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const contents = await Content.find({ userId }).populate(
      "userId",
      "username"
    );
    res.status(200).json(contents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// update a piece of content
export const updateContent = async (req: Request, res: Response) => {
  try {
    const { contentId, title, link, type, tags } = updateContentSchema.parse(
      req.body
    );
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const content = await Content.findOne({ _id: contentId, userId });
    if (!content) {
      return res
        .status(404)
        .json({ message: "Content not found or unauthorized" });
    }

    // Convert tag titles to IDs (ensure consistency)
    const tagIds = await Promise.all(
      tags.map(async (tagTitle: string) => {
        const existing = await Tag.findOneAndUpdate(
          { title: tagTitle },
          {},
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        return existing._id;
      })
    );

    const updated = await Content.findByIdAndUpdate(
      contentId,
      { title, link, type, tags: tagIds },
      { new: true }
    );

    res.status(200).json({ message: "Content updated", content: updated });
  } catch (error: any) {
    console.error("Error updating content:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a piece of content
export const deleteContent = async (req: Request, res: Response) => {
  try {
    const { contentId } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Step 1: Find the content to get its tags
    const content = await Content.findOne({ _id: contentId, userId });

    if (!content) {
      return res
        .status(404)
        .json({ message: "Content not found or not authorized" });
    }

    const tagIds = content.tags; // Save tags before deletion

    // Step 2: Delete the content
    await Content.deleteOne({ _id: contentId });

    // Step 3: Find tags that are no longer used in any other content
    const unusedTags = [];
    for (const tagId of tagIds) {
      const usedElsewhere = await Content.exists({ tags: tagId });
      if (!usedElsewhere) {
        unusedTags.push(tagId);
      }
    }

    // Step 4: Delete only unused tags
    if (unusedTags.length > 0) {
      await Tag.deleteMany({ _id: { $in: unusedTags } });
    }

    res
      .status(200)
      .json({ message: "Content and unused tags deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
