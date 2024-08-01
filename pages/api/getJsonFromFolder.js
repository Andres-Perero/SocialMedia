//getJsonFromFolder
import { listFilesInFolder, getFileContent } from "../../src/lib/googleDrive.js";
let cache = {};

export default async function handler(req, res) {
  const { folderId } = req.query;

  if (!folderId) {
    return res.status(400).json({ error: "Folder ID is required" });
  }

  if (cache[folderId]) {
    return res.status(200).json(cache[folderId]);
  }

  try {
    
    const file = await listFilesInFolder(folderId);

    if (!file.length) {
      return res.status(404).json({ error: "No files found in folder" });
    }

    const content = await getFileContent(file[0].id);
    cache[folderId] = content; // Cache the result

    res.status(200).json(content);
  } catch (error) {
    console.error("Error fetching file content:", error);
    res.status(500).json({ error: "Error fetching file content" });
  }
}
