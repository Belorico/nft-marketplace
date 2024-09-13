import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import NFTMarketplace from './artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json';

const nftMarketplaceAddress = 'DEPLOYED_CONTRACT_ADDRESS';

function App() {
  const [nfts, setNfts] = useState([]);
  const [newNFTUri, setNewNFTUri] = useState('');
  const [newNFTPrice, setNewNFTPrice] = useState('');

  useEffect(() => {
    fetchNFTs();
  }, []);

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function fetchNFTs() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(nftMarketplaceAddress, NFTMarketplace.abi, provider);
      // Fetch the NFTs (you'll likely need to implement a more robust way to fetch NFTs in practice)
    }
  }

  async function mintNFT() {
    if (!newNFTUri || !newNFTPrice) return;
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(nftMarketplaceAddress, NFTMarketplace.abi, signer);
      const transaction = await contract.mintNFT(newNFTUri, ethers.utils.parseUnits(newNFTPrice, 'ether'));
      await transaction.wait();
      fetchNFTs();
    }
  }

  async function buyNFT(tokenId, price) {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(nftMarketplaceAddress, NFTMarketplace.abi, signer);
      const transaction = await contract.buyNFT(tokenId, { value: ethers.utils.parseUnits(price.toString(), 'ether') });
      await transaction.wait();
      fetchNFTs();
    }
  }

  return (
    <div>
      <h1>NFT Marketplace</h1>
      <input onChange={e => setNewNFTUri(e.target.value)} placeholder="NFT URI" />
      <input onChange={e => setNewNFTPrice(e.target.value)} placeholder="NFT Price (ETH)" />
      <button onClick={mintNFT}>Mint NFT</button>
      
      <h2>Available NFTs</h2>
      {nfts.map((nft, index) => (
        <div key={index}>
          <p>NFT #{nft.tokenId}</p>
          <p>Price: {ethers.utils.formatUnits(nft.price, 'ether')} ETH</p>
          <button onClick={() => buyNFT(nft.tokenId, nft.price)}>Buy</button>
        </div>
      ))}
    </div>
  );
}

export default App;
