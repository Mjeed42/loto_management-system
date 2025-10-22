#!/bin/bash

# Location Management Setup Script
# This script seeds the database with the initial location hierarchy

echo "========================================="
echo "  LOTO Location Management Setup"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "backend/src/scripts/seedLocations.js" ]; then
    echo -e "${RED}Error: seedLocations.js not found!${NC}"
    echo "Please run this script from the project root directory."
    exit 1
fi

echo -e "${YELLOW}This script will:${NC}"
echo "  1. Clear existing location data"
echo "  2. Seed the database with the current location hierarchy"
echo "  3. Create all locations, lines, and machines"
echo ""
echo -e "${YELLOW}⚠️  Warning: This will delete all existing location data!${NC}"
echo ""
read -p "Do you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo -e "${RED}Setup cancelled.${NC}"
    exit 0
fi

echo ""
echo -e "${GREEN}Starting location seeding...${NC}"
echo ""

# Navigate to backend directory and run the seeder
cd backend
node src/scripts/seedLocations.js

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}=========================================${NC}"
    echo -e "${GREEN}  ✅ Setup completed successfully!${NC}"
    echo -e "${GREEN}=========================================${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Log in as an admin"
    echo "  2. Navigate to Admin Home"
    echo "  3. Click the 'Locations' button"
    echo "  4. Start managing your locations!"
    echo ""
    echo "For more information, see LOCATION_MANAGEMENT_SETUP.md"
else
    echo ""
    echo -e "${RED}=========================================${NC}"
    echo -e "${RED}  ❌ Setup failed!${NC}"
    echo -e "${RED}=========================================${NC}"
    echo ""
    echo "Please check:"
    echo "  - MongoDB connection is working"
    echo "  - Database credentials are correct"
    echo "  - .env file is configured properly"
    echo ""
    echo "For troubleshooting, see LOCATION_MANAGEMENT_SETUP.md"
fi

cd ..

















