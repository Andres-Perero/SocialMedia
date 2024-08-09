import { listFilesInFolder, getFileContent } from "../../src/lib/googleDrive.js";
let cache = {};

export default async function handler(req, res) {
  const { folderId, fileName } = req.query;

  if (!folderId || !fileName) {
    return res.status(400).json({ error: "Folder ID and File Name are required" });
  }

  // Append .json to the file name if it isn't already there
  const fullFileName = fileName.endsWith(".json") ? fileName : `${fileName}.json`;

  const cacheKey = `${folderId}_${fullFileName}`;
  if (cache[cacheKey]) {
    return res.status(200).json(cache[cacheKey]);
  }

  try {
    const files = await listFilesInFolder(folderId);

    if (!files.length) {
      return res.status(404).json({ error: "No files found in folder" });
    }

    // Search for the file by name, ensuring it's a JSON file
    const file = files.find(f => f.name === fullFileName);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    const content = await getFileContent(file.id);
    cache[cacheKey] = content; // Cache the result

    res.status(200).json(content);
  } catch (error) {
    console.error("Error fetching file content:", error);
    res.status(500).json({ error: "Error fetching file content" });
  }
}
