import { listFilesInFolder, getFileContent } from "../../src/lib/googleDrive.js";

export default async function handler(req, res) {
  const { folderId, fileName } = req.query;

  if (!folderId || !fileName) {
    return res.status(400).json({ error: "Folder ID and File Name are required" });
  }

  try {
    const files = await listFilesInFolder(folderId);

    if (!files.length) {
      return res.status(404).json({ error: "No files found in folder" });
    }

    // Buscar el archivo por nombre, asegurando que sea un archivo JSON
    const file = files.find(f => f.name === fileName);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    const content = await getFileContent(file.id);
    res.status(200).json(content);
  } catch (error) {
    console.error("Error fetching file content:", error);
    res.status(500).json({ error: "Error fetching file content" });
  }
}
