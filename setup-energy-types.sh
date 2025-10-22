#!/bin/bash

echo "Setting up Energy Types for LOTO Management System..."
echo "=================================================="

# Navigate to backend directory
cd backend

# Run the energy types seeder
echo "Running energy types seeder..."
node src/scripts/seedEnergyTypes.js

echo "Energy types setup completed!"
echo "You can now access the Energy Types Management page from the Admin panel."




















