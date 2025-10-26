import { Pinecone } from "@pinecone-database/pinecone";
import { envKeys } from "./envKeys.js";

// Define metadata type for vectors
export type ContentMetadata = {
  userId: string;
  title: string;
  link: string;
  type: string;
};

// Initialize Pinecone client
export const pinecone = new Pinecone({
  apiKey: envKeys.PINECONE_API_KEY,
});

// Create a typed index instance
export const pineconeIndex = pinecone.index<ContentMetadata>(
  envKeys.PINECONE_INDEX_NAME,
);
