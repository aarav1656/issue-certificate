import axios from "axios";

//Paste Your API's Key and Secret here
const pinataApiKey = "11154bf7be1e39173cf5";
const pinataApiSecret = "7a35cc5d76e19eb0aa7740fe7e3ca0ae811e772895666e2d9391de0806fcce23";

const pinataApiUrl = "https://api.pinata.cloud/pinning/pinFileToIPFS";

const pinataHeaders = {
  headers: {
    "Content-Type": "multipart/form-data",
    pinata_api_key: pinataApiKey,
    pinata_secret_api_key: pinataApiSecret,
  },
};

export async function uploadToIPFS(file) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(pinataApiUrl, formData, pinataHeaders);
    const ipfsHash = response.data.IpfsHash;
    return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
  } catch (error) {
    console.error("Error uploading file to Pinata:", error);
    throw error;
  }
}
