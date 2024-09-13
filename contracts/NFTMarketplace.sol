// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is ERC721URIStorage, Ownable {
    uint256 public tokenCount;
    mapping(uint256 => uint256) public nftPrices;
    mapping(uint256 => bool) public isListed;

    constructor() ERC721("Marketplace NFT", "MPNFT") {}

    // Mint a new NFT
    function mintNFT(string memory _tokenURI, uint256 _price) external onlyOwner {
        tokenCount++;
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        nftPrices[tokenCount] = _price;
        isListed[tokenCount] = true;
    }

    // Purchase an NFT
    function buyNFT(uint256 _tokenId) external payable {
        require(isListed[_tokenId], "NFT not for sale");
        require(msg.value == nftPrices[_tokenId], "Incorrect price");

        address seller = ownerOf(_tokenId);
        _transfer(seller, msg.sender, _tokenId);
        isListed[_tokenId] = false;

        payable(seller).transfer(msg.value);
    }

    // Get the price of a specific NFT
    function getNFTPrice(uint256 _tokenId) external view returns (uint256) {
        require(isListed[_tokenId], "NFT not for sale");
        return nftPrices[_tokenId];
    }

    // List an NFT for sale
    function listNFT(uint256 _tokenId, uint256 _price) external {
        require(ownerOf(_tokenId) == msg.sender, "You are not the owner");
        nftPrices[_tokenId] = _price;
        isListed[_tokenId] = true;
    }
}
