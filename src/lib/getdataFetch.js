//getdataFetch
export async function fetchJsonData(folderId) {

    if (!folderId ) {
      console.error('Folder ID or File Name is missing');
      return null;
    }
  
    try {
      const response = await fetch(`/api/getJsonFromFolder?folderId=${folderId}`);
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching JSON data:', error);
      return null;
    }
  }
  