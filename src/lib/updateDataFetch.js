// src/lib/updateDataFetch.js

export async function updateJsonFile({ folderId, fileName, newData }) {
    try {
      const response = await fetch('/api/updateJsonFile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          folderId,
          fileName,
          newData,
        }),
      });
      if (response.ok) {
        console.log("File updated successfully");
        return { success: true, data: newData };
      } else {
        console.error("Failed to update file");
        return { success: false };
      }
    } catch (error) {
      console.error("Error updating file:", error);
      return { success: false, error };
    }
  }
  