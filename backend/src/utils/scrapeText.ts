import fetch from "node-fetch";
import * as cheerio from "cheerio";

export async function extractPageText(url: string) {
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);

  // remove unwanted tags
  $("script, style, noscript").remove();
  const text = $("body").text().replace(/\s+/g, " ").trim();
  
  return text.slice(0, 4000); // limit to reasonable length
}
