/**
 * Service for handling file uploads to IPFS through backend API
 */

export const uploadFileToIPFS = async (file: File): Promise<string> => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    // Create FormData and append the file
    const data = new FormData();
    data.set("file", file);
    
    // Use the correct API endpoint path
    // For Vite, use the full path including the port
    const response = await fetch("/src/api/files", {
      method: "POST",
      body: data,
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }
    
    // Handle text response instead of JSON
    const responseText = await response.text();
    
    // If empty response, throw error
    if (!responseText) {
      throw new Error("Empty response received from server");
    }
    
    // Try to parse JSON if it looks like JSON, otherwise use as-is
    let ipfsUrl;
    if (responseText.startsWith('{') || responseText.startsWith('[')) {
      try {
        const parsedData = JSON.parse(responseText);
        // Extract URL from response depending on the structure
        ipfsUrl = parsedData.url || parsedData;
      } catch (e) {
        // If parsing fails, use the raw text
        ipfsUrl = responseText;
      }
    } else {
      ipfsUrl = responseText;
    }
    
    return ipfsUrl;
    
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const uploadJSONToIPFS = async (jsonData: any): Promise<string> => {
  try {
    // Convert JSON to a File object
    const blob = new Blob([JSON.stringify(jsonData)], { 
      type: 'application/json' 
    });
    
    const file = new File([blob], 'article.json', { type: 'application/json' });
    
    // Use the same file upload function
    return await uploadFileToIPFS(file);
  } catch (error) {
    console.error("Error uploading JSON data:", error);
    throw error;
  }
};