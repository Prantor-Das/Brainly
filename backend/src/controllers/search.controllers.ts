import type { Request, Response } from "express";
import { generateEmbedding } from "../utils/embedText.js";
import { pineconeIndex } from "../utils/pineconeClient.js";
import { Content } from "../models/content.models.js";

export const searchContent = async (req: Request, res: Response) => {
  try {
    const query = req.query.query as string;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ message: "Query is required" });
    }

    // Generate query embedding from Hugging Face
    const queryEmbedding = await generateEmbedding(query);

    // Query Pinecone for top matches
    const results = await pineconeIndex.query({
      vector: queryEmbedding,
      topK: 5,
      includeMetadata: true,
      filter: { userId }, // Only user's data
    });

    // Extract matched MongoDB IDs
    const contentIds = results.matches?.map((m) => m.id) || [];

    if (contentIds.length === 0) {
      return res.status(200).json({ query, results: [] });
    }

    // Fetch Mongo records for matched IDs
    const contents = await Content.find({ _id: { $in: contentIds } })
      .select("-embedding")
      .populate("userId", "username")
      .populate("tags", "title");

    // Preserve ranking order
    const ranked = contentIds.map((id) =>
      contents.find((c) => c._id.toString() === id),
    );

    res.status(200).json({
      query,
      results: ranked.filter(Boolean), // remove any missing entries
    });
  } catch (err) {
    console.error("Error performing vector search:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
