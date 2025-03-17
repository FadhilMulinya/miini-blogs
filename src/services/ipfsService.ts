import axios from "axios";
import { PinataParams } from "@/types/article";

// Function to upload file to IPFS using Pinata
export const pinFileToIPFS = async (file: File, options: PinataParams = {}) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  
  // Create form data
  const formData = new FormData();
  formData.append('file', file);
  
  // Add metadata if provided
  if (options.pinataMetadata) {
    formData.append('pinataMetadata', JSON.stringify(options.pinataMetadata));
  }

  // Add options if provided
  if (options.pinataOptions) {
    formData.append('pinataOptions', JSON.stringify(options.pinataOptions));
  }

  try {
    const res = await axios.post(url, formData, {
      maxBodyLength: Infinity, // Required for larger files
      headers: {
        'Content-Type': `multipart/form-data;`,
        'pinata_api_key': process.env.NEXT_PUBLIC_PINATA_API_KEY,
        'pinata_secret_api_key': process.env.NEXT_PUBLIC_PINATA_SECRET_KEY
      }
    });
  
    return {
      success: true,
      ipfsHash: res.data.IpfsHash,
      pinataUrl: `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`
    };
  } catch (error) {
    console.error("Error uploading file to IPFS:", error);
    throw error;
  }
};

// Function to upload JSON to IPFS using Pinata
export const pinJSONToIPFS = async (jsonData: any, options: PinataParams = {}) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  
  const data = {
    pinataContent: jsonData,
    pinataMetadata: options.pinataMetadata || {},
    pinataOptions: options.pinataOptions || {}
  };

  try {
    const res = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': process.env.NEXT_PUBLIC_PINATA_API_KEY,
        'pinata_secret_api_key': process.env.NEXT_PUBLIC_PINATA_SECRET_KEY
      }
    });
    
    return {
      success: true,
      ipfsHash: res.data.IpfsHash,
      pinataUrl: `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`
    };
  } catch (error) {
    console.error("Error uploading JSON to IPFS:", error);
    throw error;
  }
};