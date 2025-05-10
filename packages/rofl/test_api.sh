#!/bin/bash

# Base URL for the API
BASE_URL="http://localhost:8000/v2"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "Testing User Management API endpoints..."
echo "----------------------------------------"

# Test 1: Create a new user
echo -e "\n${GREEN}Test 1: Create a new user${NC}"
CREATE_USER_RESPONSE=$(curl -s -X POST "${BASE_URL}/users/" \
  -H "Content-Type: application/json" \
  -d '{
    "display_name": "Test User",
    "nostr_key": "npub1test123"
  }')
echo "Response: $CREATE_USER_RESPONSE"
USER_ID=$(echo $CREATE_USER_RESPONSE | jq -r '.uuid')
echo "Created user ID: $USER_ID"

# Test 2: Create a legacy user
echo -e "\n${GREEN}Test 2: Create a legacy user${NC}"
curl -s -X POST "${BASE_URL}/users/legacy/?name=Legacy%20User&age=25"

# Test 3: Get all users
echo -e "\n${GREEN}Test 3: Get all users${NC}"
curl -s -X GET "${BASE_URL}/users/"

# Test 4: Get specific user
echo -e "\n${GREEN}Test 4: Get specific user${NC}"
curl -s -X GET "${BASE_URL}/users/${USER_ID}"

# Test 5: Get last user
echo -e "\n${GREEN}Test 5: Get last user${NC}"
curl -s -X GET "${BASE_URL}/users/last/"

# Test 6: Search users
echo -e "\n${GREEN}Test 6: Search users${NC}"
curl -s -X GET "${BASE_URL}/users/search/Test"

# Test 7: Create a chat and join it
echo -e "\n${GREEN}Test 7: Create a chat and join it${NC}"
# First create a chat (assuming chat creation endpoint exists)
CHAT_ID="test-chat-123"
curl -s -X POST "${BASE_URL}/chats/" \
  -H "Content-Type: application/json" \
  -d '{
    "uuid": "'${CHAT_ID}'",
    "name": "Test Chat"
  }'

# Join the chat
echo -e "\n${GREEN}Test 8: Join chat${NC}"
curl -s -X POST "${BASE_URL}/users/${USER_ID}/join-chat/${CHAT_ID}"

# Test 9: Get chat feed
echo -e "\n${GREEN}Test 9: Get chat feed${NC}"
curl -s -X GET "${BASE_URL}/users/${USER_ID}/chat-feed"

# Test 10: Leave chat
echo -e "\n${GREEN}Test 10: Leave chat${NC}"
curl -s -X POST "${BASE_URL}/users/${USER_ID}/leave-chat/${CHAT_ID}"

echo -e "\n----------------------------------------"
echo "All tests completed!"