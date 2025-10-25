import type { Request, Response } from "express";
import { Link } from "../models/link.models.js";
import { random } from "../utils/random.js";
import { Content } from "../models/content.models.js";
import { User } from "../models/user.models.js";
import { shareLinkSchema, shareSchema } from "../validations/brain.js";

export const shareContent = async (req: Request, res: Response) => {
  try {
    const { share } = shareSchema.parse(req.body);
    if (share) {
      // Check if a link already exists for the user.
      const existingLink = await Link.findOne({ userId: req.userId });

      if (existingLink) {
        res.json({ hash: existingLink.hash }); // Send existing hash if found.
        return;
      }

      // Generate a new hash for the shareable link.
      const hash = random(10);

      // Save the new link in the database.
      await Link.create({ userId: req.userId, hash });

      res.json({ hash }); // Send new hash in the response.
    } else {
      // Remove the shareable link if `share` is false.
      const deleted = await Link.deleteOne({ userId: req.userId });

      if (deleted.deletedCount === 0) {
        res.status(404).json({ message: "No existing link to remove." });
        return;
      }

      res.status(200).json({ message: "Link removed successfully." }); // Send success response.
    }
  } catch (error) {
    console.error("Error in shareContent:", error);
    res.status(500).json({ message: "Server error while sharing content." });
  }
};

export const getSharedContent = async (req: Request, res: Response) => {
  try {
    const { shareLink: hash } = shareLinkSchema.parse(req.params); 

    // Validate input
    if (!hash) {
      res.status(400).json({ message: "Share link hash is required." });
      return;
    }

    // Find the link using the provided hash.
    const link = await Link.findOne({ hash });

    if (!link) {
      res.status(404).json({ message: "Invalid or expired share link." });
      return;
    }

    // Fetch content and user details for the shareable link.
    const [content, user] = await Promise.all([
      Content.find({ userId: link.userId }),
      User.findOne({ _id: link.userId }).select("username")
    ]);

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // Send user and content details in the response.
    res.status(200).json({
      username: user.username,
      content,
    });
  } catch (error) {
    console.error("Error in getLink:", error);
    res.status(500).json({ message: "Server error while retrieving link data." });
  }
};
