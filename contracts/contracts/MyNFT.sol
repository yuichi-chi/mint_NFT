// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MyNFT is ERC721, ERC721Enumerable, Ownable {
    using Strings for uint256;

    uint256 public constant MINT_PRICE = 0.000001 ether;
    uint256 public constant MAX_SUPPLY = 1000;
    string public baseURI;

    mapping(address => uint256) public mintCount;

    constructor(string memory _name, string memory _symbol, string memory _baseURI)
        ERC721(_name, _symbol)
        Ownable(msg.sender)
    {
        baseURI = _baseURI;
    }

    function mint() public payable {
        require(msg.sender != owner(), "Owner should use ownerMint");
        require(msg.value >= MINT_PRICE, "Insufficient payment");
        require(totalSupply() < MAX_SUPPLY, "Max supply reached");
        require(mintCount[msg.sender] == 0, "You can only mint one NFT per address");

        uint256 tokenId = totalSupply() + 1;
        _safeMint(msg.sender, tokenId);
        mintCount[msg.sender] += 1;
    }

    function ownerMint(uint256 quantity) public onlyOwner {
        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = totalSupply() + 1;
            _safeMint(msg.sender, tokenId);
        }
    }

    function ownerMint() public onlyOwner {
        uint256 tokenId = totalSupply() + 1;
        _safeMint(msg.sender, tokenId);
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }

    /// ✅ BaseURI getter（OpenSeaが参照）
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    /// ✅ BaseURI setter（後から変更もできる）
    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    /// ✅ 追加：OpenSea・MetaMask用にtokenURI()を明示的に定義
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return string(abi.encodePacked(_baseURI(), tokenId.toString(), ".json"));
    }

    // Required override for ERC721Enumerable
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
