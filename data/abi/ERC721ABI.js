export const ERC721ABI = [
    // Read-Only Functions
    "function awardItem() public returns (uint256)",
    "function getNFT(uint256 tokenId) public view returns (uint256, uint256, uint256, bool)",
    "function mergeNFTs(uint256 tokenLevel1Id1, uint256 tokenLevel1Id2, uint256 tokenLevel2Id) public",
    "function ownOf(address owner) public view returns (uint256[] memory, uint256[] memory)",
    "function isEligible(address player) public view returns (bool, uint256, uint256)"
];