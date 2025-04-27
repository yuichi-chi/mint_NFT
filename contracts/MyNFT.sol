// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyNFT is ERC721, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // コントラクト設定
    uint256 public constant MAX_SUPPLY = 400;
    uint256 public constant MINT_PRICE = 0.000001 ether;
    uint256 public constant MAX_PER_ADDRESS = 1;

    // 状態変数
    string private baseTokenURI;
    mapping(address => uint256) public mintedPerAddress;
    uint256 public totalMinted;

    // イベント
    event Minted(address indexed to, uint256 indexed tokenId, uint256 price);
    event BaseURIUpdated(string newBaseURI);
    event Withdrawn(address indexed owner, uint256 amount);

    constructor(
        string memory name,
        string memory symbol,
        string memory baseURI
    ) ERC721(name, symbol) {
        baseTokenURI = baseURI;
    }

    // ミント関数
    function mint() external payable nonReentrant {
        require(totalMinted < MAX_SUPPLY, "Max supply reached");
        require(msg.value >= MINT_PRICE, "Insufficient payment");
        require(mintedPerAddress[msg.sender] < MAX_PER_ADDRESS, "Max per address reached");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _safeMint(msg.sender, newTokenId);
        mintedPerAddress[msg.sender]++;
        totalMinted++;

        emit Minted(msg.sender, newTokenId, msg.value);
    }

    // オーナー専用ミント関数
    function ownerMint(address to) external onlyOwner {
        require(totalMinted < MAX_SUPPLY, "Max supply reached");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _safeMint(to, newTokenId);
        totalMinted++;

        emit Minted(to, newTokenId, 0);
    }

    // ベースURIの更新
    function setBaseURI(string memory newBaseURI) external onlyOwner {
        baseTokenURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
    }

    // 資金の引き出し
    function withdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Withdrawal failed");
        
        emit Withdrawn(owner(), balance);
    }

    // オーバーライド関数
    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    // サポート関数
    function getMintedCount(address account) external view returns (uint256) {
        return mintedPerAddress[account];
    }

    function getTotalMinted() external view returns (uint256) {
        return totalMinted;
    }

    function getRemainingSupply() external view returns (uint256) {
        return MAX_SUPPLY - totalMinted;
    }
} 