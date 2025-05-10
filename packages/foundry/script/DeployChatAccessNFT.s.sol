// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DeployHelpers.s.sol";
import "../contracts/ChatAccessNFT.sol";

/**
 * @notice Deploy script for ChatAccessNFT contract
 */
contract DeployChatAccessNFT is ScaffoldETHDeploy {
    function run() external ScaffoldEthDeployerRunner {
        // Deploy the ChatAccessNFT contract
        ChatAccessNFT chatNFT = new ChatAccessNFT();

        // Add deployment to the list for export
        deployments.push(Deployment("ChatAccessNFT", address(chatNFT)));
    }
}