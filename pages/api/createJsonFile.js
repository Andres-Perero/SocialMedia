import { createNewFile } from "../../src/lib/googleDrive.js";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { folderId, fileName, newData } = req.body;

  if (!folderId || !fileName || !newData) {
    return res.status(400).json({ error: "Folder ID, File Name, and New Data are required" });
  }

  try {
    const result = await createNewFile(folderId, fileName, newData);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error creating file:", error);
    res.status(500).json({ error: "Error creating file" });
  }
}
