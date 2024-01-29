import React, { useState } from "react";
import { connectWallet, connectMetaMask } from "./connectWallet";
import { uploadToIPFS } from "./ipfsUploader";

import NFTImage from "./images/tour.png";

import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Link,
  Grid,
  Snackbar,
  Alert,
  LinearProgress,
} from "@mui/material";

function MintNFT() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [address, setAddress] = useState();
  const [status, setStatus] = useState("");
  const [ipfsLink, setIpfsLink] = useState("");
  const [imageStatus, setImageStatus] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [transactionHistory, setTransactionHistory] = useState([]);

  const handleConnectMetaMask = async () => {
    const { address, formattedBalance } = await connectMetaMask();
    setWalletAddress(address);
    setWalletBalance(formattedBalance);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setImageStatus("Image selected for upload");
    setImagePreviewUrl(URL.createObjectURL(e.target.files[0]));
  };

  const mint = async () => {
    setStatus("Uploading to IPFS...");
    const imageURI = await uploadToIPFS(image);
    setIpfsLink(imageURI);

    setStatus("Minting NFT...");
    setLoading(true);
    const { signer, contract } = await connectWallet();
    const tokenURI = `data:application/json;base64,${btoa(
      JSON.stringify({
        name,
        description,
        image: imageURI,
      })
    )}`;

    const transaction = await contract.mintNFT(address, tokenURI);
    await transaction.wait();
    console.log("lol")

    setTransactionHistory((prevHistory) => [...prevHistory, transaction.hash]);

    setStatus("NFT minted!");
    setAlertOpen(true);
    setLoading(false);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          style={{ color: "white" }}
        >
          Issue Cerificates as NFT
        </Typography>
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSh0cyYL2vjZ19qZD68kjvx2LzsO-eOz2AFmLwwxDFxA&s"
          alt="NFT Minter"
          style={{
            display: "block",
            margin: "100px auto 0px auto",
            maxWidth: "100%",
          }}
        />
      </Box>
      <img src="images/bg-top.svg" alt="" className="bg-top" />

      <Box className="main">
        <Box className="left">
          <h1>
            <span className="purple">Decentralization for everyone</span>{" "}
          </h1>
          <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, r         </p>
        </Box>

        <Box className="right">
          <img src="/images/bitcoin-logo.svg" alt="" className="btc-img" />
        </Box>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box mt={2}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleConnectMetaMask}
              size="small"
              disabled={Boolean(walletAddress)}
            >
              {walletAddress
                ? "Wallet Connected"
                : "Connect Wallet to this dapp"}
            </Button>
          </Box>
          {walletAddress && (
            <Box mt={2}>
              <Typography
                align="center"
                style={{ color: "#941b0c", fontFamily: "Arial" }}
              >
                Wallet Address: {walletAddress}
              </Typography>
              <Typography
                align="center"
                style={{
                  color: "#941b0c",
                  fontFamily: "Arial",
                }}
              >
                Wallet Balance: {walletBalance} Matic
              </Typography>
            </Box>
          )}
          <TextField
            fullWidth
            label="NFT Name"
            variant="filled"
            margin="normal"
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            fullWidth
            label="NFT Description"
            variant="filled"
            margin="normal"
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            fullWidth
            label="Address where to mint"
            variant="filled"
            margin="normal"
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            type="file"
            style={{ display: "none" }}
            id="image-upload"
            onChange={handleImageChange}
          />
          <p></p>
          <label htmlFor="image-upload">
            <Button variant="contained" color="primary" component="span">
              Upload Image
            </Button>
          </label>
          {imageStatus && (
            <Typography variant="caption" display="block" gutterBottom>
              {imageStatus}
            </Typography>
          )}
          <Box mt={2}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={mint}
            >
              Mint NFT
            </Button>
          </Box>
          {loading && <LinearProgress />}

          <Snackbar
            open={alertOpen}
            autoHideDuration={6000}
            onClose={() => setAlertOpen(false)}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert
              onClose={() => setAlertOpen(false)}
              severity="success"
              variant="filled"
              sx={{ width: "100%" }}
            >
              NFT minted successfully!
            </Alert>
          </Snackbar>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            mt={2}
            sx={{
              border: "1px dashed #999",
              borderRadius: "12px",
              padding: "16px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "300px",
              background: imagePreviewUrl
                ? "none"
                : "linear-gradient(45deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)",
            }}
          >
            {imagePreviewUrl ? (
              <img
                src={imagePreviewUrl}
                alt="Uploaded preview"
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  objectFit: "contain",
                  borderRadius: "12px",
                }}
              />
            ) : (
              <Typography variant="caption" color="text.secondary">
                Preview image will be displayed here
              </Typography>
            )}
          </Box>
        </Grid>
        <Box mt={2}>
          <Typography align="center" color="textSecondary">
            {status}
          </Typography>
          {ipfsLink && (
            <Typography align="left">
              IPFS Link:{" "}
              <Link
                href={ipfsLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#ee2e31" }}
              >
                {ipfsLink}
              </Link>
            </Typography>
          )}
        </Box>
      </Grid>
      <Box mt={4}>
        <Typography variant="h7" align="center">
          Transaction History:
        </Typography>
        {transactionHistory.length > 0 ? (
          transactionHistory.map((hash, index) => (
            <Box key={index} mt={1} textAlign="left">
              <Link
                href={`https://mumbai.polygonscan.com/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#ee2e31" }}
              >
                {`Transaction ${index + 1}: ${hash}`}
              </Link>
            </Box>
          ))
        ) : (
          <Typography align="center" mt={1}>
            No transactions yet.
          </Typography>
        )}
      </Box>
    </Container>
  );
}

export default MintNFT;
