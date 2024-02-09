import { ethers } from "ethers";
import NFTMinter from "./Nft-Minter.json";

export async function connectWallet() {
  await window.ethereum.request({ method: "eth_requestAccounts" });
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const contract = new ethers.Contract(
    "0xDceBF6170eF32D0E7cBb8BE8D46240e7a95b0A43", // Paste your Deployed NFT contract address
    NFTMinter.abi,
    signer
  );

  return { signer, contract };
}

export async function connectMetaMask() {
  const { signer } = await connectWallet();
  const address = await signer.getAddress();
  const balance = await signer.getBalance();
  const formattedBalance = ethers.utils.formatEther(balance);
  return { address, formattedBalance };
}
