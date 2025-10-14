const mongoose = require("mongoose");
const EnergyType = require("../models/EnergyType");

// Direct connection string (for testing)
const MONGO_URI =
  "mongodb+srv://loto_app_user:6hsMKn4SwqFKpPtV@loto-cluster.e2qnwyn.mongodb.net/loto-app?retryWrites=true&w=majority";

const seedEnergyTypes = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB successfully!");

    // Clear existing energy types
    await EnergyType.deleteMany({});
    console.log("Cleared existing energy types");

    // Define initial energy types
    const energyTypes = [
      {
        name: "Electrical",
        symbol: "⚡",
        description: "Electrical energy and power systems",
        category: "electrical",
        hazardLevel: "high",
      },
      {
        name: "Hydraulic Pressure",
        symbol: "💧",
        description: "Hydraulic fluid pressure systems",
        category: "hydraulic",
        hazardLevel: "high",
      },
      {
        name: "Pneumatic Pressure",
        symbol: "💨",
        description: "Compressed air and pneumatic systems",
        category: "pneumatic",
        hazardLevel: "medium",
      },
      {
        name: "Steam",
        symbol: "🔥",
        description: "High-pressure steam systems",
        category: "thermal",
        hazardLevel: "high",
      },
      {
        name: "Hot Water",
        symbol: "🌡️",
        description: "Hot water and heating systems",
        category: "thermal",
        hazardLevel: "medium",
      },
      {
        name: "Mechanical",
        symbol: "⚙️",
        description: "Mechanical energy and moving parts",
        category: "mechanical",
        hazardLevel: "medium",
      },
      {
        name: "Chemical",
        symbol: "🧪",
        description: "Chemical substances and reactions",
        category: "chemical",
        hazardLevel: "critical",
      },
      {
        name: "Gravity",
        symbol: "⬇️",
        description: "Gravitational energy and suspended loads",
        category: "mechanical",
        hazardLevel: "medium",
      },
      {
        name: "Spring Energy",
        symbol: "🔄",
        description: "Stored mechanical energy in springs",
        category: "mechanical",
        hazardLevel: "medium",
      },
      {
        name: "Kinetic Energy",
        symbol: "🏃",
        description: "Energy from moving objects",
        category: "mechanical",
        hazardLevel: "medium",
      },
    ];

    // Insert energy types
    const createdEnergyTypes = await EnergyType.insertMany(energyTypes);
    console.log(`Successfully created ${createdEnergyTypes.length} energy types:`);
    
    createdEnergyTypes.forEach((et) => {
      console.log(`- ${et.symbol} ${et.name} (${et.category}, ${et.hazardLevel} risk)`);
    });

    console.log("\nEnergy types seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding energy types:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Run the seeder
seedEnergyTypes();


