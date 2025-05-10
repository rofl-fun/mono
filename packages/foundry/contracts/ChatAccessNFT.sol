// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ChatAccessNFT
 * @dev NFT contract for tokengated chat access
 */
contract ChatAccessNFT is ERC721, Ownable {
    // Constants
    uint256 private constant PLATFORM_FEE = 500; // 5% (out of 10000)
    uint256 private constant FEE_DENOMINATOR = 10000;

    // Structs
    struct ChatCollection {
        address creator;
        uint256 price;
        string chatId;
        bool exists;
    }

    // State variables
    uint256 private _nextTokenId;
    uint256 private _nextCollectionId;

    mapping(uint256 => ChatCollection) public collections; // collectionId => ChatCollection
    mapping(uint256 => uint256) public tokenCollection; // tokenId => collectionId
    mapping(string => uint256) public chatIdToCollection; // chatId => collectionId

    // Events
    event ChatCollectionCreated(uint256 indexed collectionId, address indexed creator, uint256 price, string chatId);
    event TokenMinted(uint256 indexed tokenId, uint256 indexed collectionId, address indexed minter);
    event PlatformFeesWithdrawn(address indexed owner, uint256 amount);

    constructor() ERC721("Chat Access Token", "CHAT") Ownable(msg.sender) {}

    /**
     * @dev Creates a new chat collection
     * @param price Price in wei to mint an NFT from this collection
     * @param chatId Unique identifier for the chat room
     */
    function createChatCollection(uint256 price, string calldata chatId) external returns (uint256) {
        // Ensure chatId doesn't already exist
        require(chatIdToCollection[chatId] == 0, "Chat ID already exists");

        uint256 collectionId = _nextCollectionId++;

        collections[collectionId] = ChatCollection({
            creator: msg.sender,
            price: price,
            chatId: chatId,
            exists: true
        });

        // Store the reverse mapping
        chatIdToCollection[chatId] = collectionId;

        emit ChatCollectionCreated(collectionId, msg.sender, price, chatId);
        return collectionId;
    }

    /**
     * @dev Gets collection info by chat ID
     * @param chatId The chat ID to look up
     * @return collectionId The ID of the collection
     * @return creator The address of the collection creator
     * @return price The price to mint an NFT from this collection
     */
    function getCollectionByChatId(string calldata chatId) external view returns (
        uint256 collectionId,
        address creator,
        uint256 price
    ) {
        collectionId = chatIdToCollection[chatId];
        require(collections[collectionId].exists, "Chat collection does not exist");

        ChatCollection memory collection = collections[collectionId];
        return (collectionId, collection.creator, collection.price);
    }

    /**
     * @dev Mints a new token from a specific collection
     * @param collectionId The ID of the collection to mint from
     */
    function mint(uint256 collectionId) external payable {
        ChatCollection memory collection = collections[collectionId];
        require(collection.exists, "Collection does not exist");
        require(msg.value == collection.price, "Incorrect payment amount");

        // Calculate fees
        uint256 platformFee = (msg.value * PLATFORM_FEE) / FEE_DENOMINATOR;
        uint256 creatorPayment = msg.value - platformFee;

        // Pay the creator
        (bool success, ) = collection.creator.call{value: creatorPayment}("");
        require(success, "Failed to send payment to creator");

        // Mint the token
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        tokenCollection[tokenId] = collectionId;

        emit TokenMinted(tokenId, collectionId, msg.sender);
    }

    /**
     * @dev Withdraws accumulated platform fees
     */
    function withdrawPlatformFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");

        (bool success, ) = owner().call{value: balance}("");
        require(success, "Failed to withdraw fees");

        emit PlatformFeesWithdrawn(owner(), balance);
    }

    /**
     * @dev Returns the chat ID for a given token
     * @param tokenId The ID of the token
     */
    function getChatId(uint256 tokenId) external view returns (string memory) {
        return collections[tokenCollection[tokenId]].chatId;
    }

    /**
     * @dev Checks if an address has access to a specific chat
     * @param user The address to check
     * @param chatId The chat ID to verify access for
     */
    function hasAccess(address user, string calldata chatId) external view returns (bool) {
        uint256 balance = balanceOf(user);
        for (uint256 i = 0; i < _nextTokenId; i++) {
            if (ownerOf(i) == user) {
                if (keccak256(bytes(collections[tokenCollection[i]].chatId)) == keccak256(bytes(chatId))) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * @dev Required override for supportsInterface
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}