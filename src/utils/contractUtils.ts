// This file can be simplified or removed since ownership check is no longer needed
import { ethers } from "ethers";
import MiniBlogABI from "../contracts/abi.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

// Utility to get contract information
export const getContractInfo = async () => {
  try {
    if (!window.ethereum) return null;
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      MiniBlogABI.abi,
      provider
    );
    
    // Get basic contract info if available
    const info = {
      address: CONTRACT_ADDRESS,
      // Add other public info if available
      // e.g., name: await contract.name()
    };
    
    return info;
  } catch (error) {
    console.error("Error getting contract information:", error);
    return null;
  }
};