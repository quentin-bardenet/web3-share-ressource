// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import {Base64} from "./libraries/Base64.sol";

contract MyNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(uint256 => address) private nftIndexToOwner;

    string baseSvg =
        "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

    event NewNFTMinted(address indexed from, uint256 itemId);

    constructor() ERC721("Web3RessourcesNFT", "W3NFT") {
        console.log("MyNFT Contract ready to go !");
    }

    function random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }

    function makeNFT(address _to) public {
        uint256 newItemId = _tokenIds.current();

        string memory finalSvg = string(
            abi.encodePacked(
                baseSvg,
                "Active user Medal ID ",
                Strings.toString(newItemId),
                "</text></svg>"
            )
        );

        // Get all the JSON metadata in place and base64 encode it.
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "Active user Medal !", "description": "Web3 Ressources NFT for active users.", "image": "data:image/svg+xml;base64,',
                        // We add data:image/svg+xml;base64 and then append our base64 encode our svg.
                        Base64.encode(bytes(finalSvg)),
                        '"}'
                    )
                )
            )
        );

        // Just like before, we prepend data:application/json;base64, to our data.
        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        _safeMint(_to, newItemId);
        emit NewNFTMinted(_to, newItemId);

        // Update your URI!!!
        _setTokenURI(newItemId, finalTokenUri);
        nftIndexToOwner[newItemId] = _to;

        _tokenIds.increment();
    }

    function tokensOfOwner(address _owner)
        external
        view
        returns (uint256[] memory ownerTokens)
    {
        uint256 tokenCount = balanceOf(_owner);

        if (tokenCount == 0) {
            // Return an empty array
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](tokenCount);
            uint256 totalNFT = _tokenIds.current() + 1;
            uint256 resultIndex = 0;

            uint256 nftId;

            for (nftId = 1; nftId <= totalNFT; nftId++) {
                if (nftIndexToOwner[nftId] == _owner) {
                    result[resultIndex] = nftId;
                    resultIndex++;
                }
            }

            return result;
        }
    }
}
