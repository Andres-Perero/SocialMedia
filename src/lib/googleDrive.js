import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];

const auth = new google.auth.GoogleAuth({
  credentials: {
    type: 'service_account',
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: process.env.GOOGLE_AUTH_URI,
    token_uri: process.env.GOOGLE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
  },
  scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });

async function listFilesInFolder(folderId) {
  try {
    
    const res = await drive.files.list({
      q: `'${folderId}' in parents and mimeType='application/json'`,
      fields: 'files(id, name)',
    });
  
    return res.data.files;
  } catch (error) {
    console.error('Error listing files in folder:', error);
    throw error;
  }
}

async function getFileContent(fileId) {
  try {
    const response = await drive.files.get(
      {
        fileId: fileId,
        alt: 'media',
      },
      { responseType: 'stream' }
    );

    const data = await new Promise((resolve, reject) => {
      let buf = '';
      response.data.on('data', (chunk) => {
        buf += chunk;
      });
      response.data.on('end', () => {
        resolve(buf);
      });
      response.data.on('error', (err) => {
        reject(err);
      });
    });

    
    return JSON.parse(data);
  } catch (error) {
    console.error('Error retrieving file content:', error);
    throw error;
  }
}

export { listFilesInFolder, getFileContent };
