import { pinata } from "@/utils/config";

export const uploadFileDirectlyToIPFS = async (file: File): Promise<string> => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }
    
    // Upload file directly using pinata SDK
    const { cid } = await pinata.upload.public.file(file);
    
    // Convert CID to gateway URL
    const url = await pinata.gateways.public.convert(cid);
    
    return url;
  } catch (error) {
    console.error("Error uploading file directly:", error);
    throw error;
  }
};

export const uploadJSONDirectlyToIPFS = async (jsonData: any): Promise<string> => {
  try {
    // Upload JSON directly using pinata SDK
    const { cid } = await pinata.upload.public.json(jsonData);
    
    // Convert CID to gateway URL
    const url = await pinata.gateways.public.convert(cid);
    
    return url;
  } catch (error) {
    console.error("Error uploading JSON directly:", error);
    throw error;
  }
};