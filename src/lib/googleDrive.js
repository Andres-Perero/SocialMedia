import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
  credentials: {
    type: "service_account",
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: process.env.GOOGLE_AUTH_URI,
    token_uri: process.env.GOOGLE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
  },
  scopes: SCOPES,
});

const drive = google.drive({ version: "v3", auth });

async function listFilesInFolder(folderId) {

  try {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and mimeType='application/json'`,
      fields: "files(id, name)",
    });

    return res.data.files;
  } catch (error) {
    console.error("Error listing files in folder:", error);
    throw error;
  }
}

async function getFileContent(fileId) {

  try {
    const response = await drive.files.get(
      {
        fileId: fileId,
        alt: "media",
      },
      { responseType: "stream" }
    );

    const data = await new Promise((resolve, reject) => {
      let buf = "";
      response.data.on("data", (chunk) => {
        buf += chunk;
      });
      response.data.on("end", () => {
        resolve(buf);
      });
      response.data.on("error", (err) => {
        reject(err);
      });
    });
    return JSON.parse(data);
  } catch (error) {
    console.error("Error retrieving file content:", error);
    throw error;
  }
}

export async function updateFileContent(folderId, fileName, newData) {
  console.log("updateFileContent",fileName)
  try {
    //const fullFileName = fileName.endsWith('.json') ? fileName : `${fileName}.json`;

    const files = await drive.files.list({
      q: `'${folderId}' in parents and name='${fileName}' and mimeType='application/json'`,
      fields: "files(id, name)",
    });

    if (files.data.files.length === 0) {
      console.error(`File not found: ${fileName} in folder: ${folderId}`);
      throw new Error("File not found");
    }

    const fileId = files.data.files[0].id;
    const updatedFile = await drive.files.update({
      fileId,
      media: {
        mimeType: "application/json",
        body: JSON.stringify(newData, null, 2), // Pretty print JSON
      },
    });
    return { success: true, data: updatedFile.data };
  } catch (error) {
    console.error("Error updating file content:", error);
    throw error;
  }
}

async function createNewFile(folderId, fileName, newData) {
  try {
    const fileMetadata = {
      name: fileName,
      mimeType: "application/json",
      parents: [folderId],
    };

    const media = {
      mimeType: "application/json",
      body: JSON.stringify(newData, null, 2), // Pretty print JSON
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id, name",
    });

    return response.data;
  } catch (error) {
    console.error("Error creating file:", error);
    throw error;
  }
}

export { listFilesInFolder, getFileContent, createNewFile };
