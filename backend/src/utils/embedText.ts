import { InferenceClient } from "@huggingface/inference";
import { envKeys } from "./envKeys.js";

const hf = new InferenceClient(envKeys.HUGGINGFACE_API_KEY);

export async function generateEmbedding(text: string): Promise<number[]> {
  const model = "sentence-transformers/all-MiniLM-L6-v2";

  const res = (await hf.featureExtraction({
    model,
    inputs: text,
  })) as number[] | number[][] | number[][][];

  // Handle all possible result shapes
  if (Array.isArray(res[0])) {
    const first = res[0] as number[] | number[][];
    if (Array.isArray(first[0])) {
      return (first as number[][]).flat();
    }
    return first as number[];
  }

  if (typeof res[0] === "number") {
    return res as number[];
  }

  throw new Error("Unexpected embedding format from Hugging Face API");
}
