const mongoose = require("mongoose");
const Location = require("../models/Location");
require("dotenv").config();

// MongoDB connection
const MONGO_URI = process.env.MONGODB_URI ||  
  "mongodb+srv://loto_app_user:6hsMKn4SwqFKpPtV@loto-cluster.e2qnwyn.mongodb.net/loto-app?retryWrites=true&w=majority";

// Location hierarchy data based on current system
const locationData = [
  {
    name: "PKG",
    code: "PKG",
    type: "location",
    lines: [
      {
        name: "A",
        code: "A",
        machines: Array.from({length: 50}, (_, i) => ({
          name: `DA${String(i + 1).padStart(2, "0")}`,
          code: `DA${String(i + 1).padStart(2, "0")}`
        }))
      },
      {
        name: "B",
        code: "B",
        machines: Array.from({length: 50}, (_, i) => ({
          name: `DB${String(i + 1).padStart(2, "0")}`,
          code: `DB${String(i + 1).padStart(2, "0")}`
        }))
      },
      {
        name: "C",
        code: "C",
        machines: Array.from({length: 50}, (_, i) => ({
          name: `DC${String(i + 1).padStart(2, "0")}`,
          code: `DC${String(i + 1).padStart(2, "0")}`
        }))
      },
      {
        name: "D",
        code: "D",
        machines: Array.from({length: 50}, (_, i) => ({
          name: `DD${String(i + 1).padStart(2, "0")}`,
          code: `DD${String(i + 1).padStart(2, "0")}`
        }))
      },
      {
        name: "Multi-Bag",
        code: "MB",
        machines: Array.from({length: 10}, (_, i) => ({
          name: `MB${String(i + 1).padStart(2, "0")}`,
          code: `MB${String(i + 1).padStart(2, "0")}`
        }))
      }
    ]
  },
  {
    name: "Process",
    code: "PROCESS",
    type: "location",
    lines: [
      { 
        name: "PC", 
        code: "PC", 
        machines: [
          { name: "Concentrator-01", code: "CON-01" },
          { name: "Concentrator-02", code: "CON-02" }
        ]
      },
      { 
        name: "TC", 
        code: "TC", 
        machines: [
          { name: "Tank-01", code: "TNK-01" },
          { name: "Tank-02", code: "TNK-02" }
        ]
      },
      { 
        name: "FCP", 
        code: "FCP", 
        machines: [
          { name: "FCP-Unit-01", code: "FCP-01" },
          { name: "FCP-Unit-02", code: "FCP-02" }
        ]
      },
      { 
        name: "RBS", 
        code: "RBS", 
        machines: [
          { name: "RBS-Unit-01", code: "RBS-01" },
          { name: "RBS-Unit-02", code: "RBS-02" }
        ]
      },
      { 
        name: "CKF", 
        code: "CKF", 
        machines: [
          { name: "CKF-Unit-01", code: "CKF-01" },
          { name: "CKF-Unit-02", code: "CKF-02" }
        ]
      }
    ]
  },
  {
    name: "Utility",
    code: "UTILITY",
    type: "location",
    lines: [
      { 
        name: "Chiller", 
        code: "CHILLER", 
        machines: [
          { name: "Chiller-01", code: "CH-01" },
          { name: "Chiller-02", code: "CH-02" },
          { name: "Chiller-03", code: "CH-03" }
        ]
      },
      { 
        name: "AC", 
        code: "AC", 
        machines: [
          { name: "AC-Unit-01", code: "AC-01" },
          { name: "AC-Unit-02", code: "AC-02" }
        ]
      },
      { 
        name: "Pump", 
        code: "PUMP", 
        machines: [
          { name: "Pump-01", code: "PMP-01" },
          { name: "Pump-02", code: "PMP-02" },
          { name: "Pump-03", code: "PMP-03" }
        ]
      },
      { 
        name: "Gate", 
        code: "GATE", 
        machines: [
          { name: "Gate-01", code: "GT-01" },
          { name: "Gate-02", code: "GT-02" }
        ]
      }
    ]
  },
  {
    name: "WH-FG",
    code: "WH-FG",
    type: "location",
    lines: [
      { 
        name: "Gate", 
        code: "GATE-FG", 
        machines: [
          { name: "Gate-FG-01", code: "GT-FG-01" },
          { name: "Gate-FG-02", code: "GT-FG-02" }
        ]
      },
      { 
        name: "Dock Leveler", 
        code: "DL-FG", 
        machines: [
          { name: "Dock-Leveler-FG-01", code: "DL-FG-01" },
          { name: "Dock-Leveler-FG-02", code: "DL-FG-02" }
        ]
      },
      { 
        name: "Crate Dumper", 
        code: "CD-FG", 
        machines: [
          { name: "Crate-Dumper-FG-01", code: "CD-FG-01" }
        ]
      },
      { 
        name: "Pallet Inverter", 
        code: "PI-FG", 
        machines: [
          { name: "Pallet-Inverter-FG-01", code: "PI-FG-01" }
        ]
      },
      { 
        name: "Banker", 
        code: "BNK-FG", 
        machines: [
          { name: "Banker-FG-01", code: "BNK-FG-01" },
          { name: "Banker-FG-02", code: "BNK-FG-02" }
        ]
      }
    ]
  },
  {
    name: "WH-RM",
    code: "WH-RM",
    type: "location",
    lines: [
      { 
        name: "Gate", 
        code: "GATE-RM", 
        machines: [
          { name: "Gate-RM-01", code: "GT-RM-01" },
          { name: "Gate-RM-02", code: "GT-RM-02" }
        ]
      },
      { 
        name: "Dock Leveler", 
        code: "DL-RM", 
        machines: [
          { name: "Dock-Leveler-RM-01", code: "DL-RM-01" },
          { name: "Dock-Leveler-RM-02", code: "DL-RM-02" }
        ]
      },
      { 
        name: "Crate Dumper", 
        code: "CD-RM", 
        machines: [
          { name: "Crate-Dumper-RM-01", code: "CD-RM-01" }
        ]
      },
      { 
        name: "Pallet Inverter", 
        code: "PI-RM", 
        machines: [
          { name: "Pallet-Inverter-RM-01", code: "PI-RM-01" }
        ]
      },
      { 
        name: "Banker", 
        code: "BNK-RM", 
        machines: [
          { name: "Banker-RM-01", code: "BNK-RM-01" },
          { name: "Banker-RM-02", code: "BNK-RM-02" }
        ]
      }
    ]
  },
  {
    name: "Project",
    code: "PROJECT",
    type: "location",
    lines: [
      { 
        name: "General", 
        code: "GEN", 
        machines: [
          { name: "Project-Equipment-01", code: "PRJ-01" },
          { name: "Project-Equipment-02", code: "PRJ-02" }
        ]
      }
    ]
  }
];

async function seedLocations() {
  try {
    console.log("========================================");
    console.log("  LOTO Location Seeder");
    console.log("========================================\n");
    
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected\n");

    // Clear existing locations
    console.log("Clearing existing locations...");
    const deleteResult = await Location.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.deletedCount} existing locations\n`);

    let totalCreated = 0;
    let locationCount = 0;
    let lineCount = 0;
    let machineCount = 0;

    // Create locations with hierarchy
    for (const locationItem of locationData) {
      console.log(`📍 Creating location: ${locationItem.name}...`);
      
      // Create root location
      const rootLocation = await Location.create({
        name: locationItem.name,
        code: locationItem.code,
        type: "location",
        isActive: true,
        isLeaf: false,
      });
      totalCreated++;
      locationCount++;
      console.log(`   ✅ Created location: ${rootLocation.name} (${rootLocation.code})`);

      // Create lines for this location
      for (const lineItem of locationItem.lines) {
        const line = await Location.create({
          name: lineItem.name,
          code: lineItem.code,
          type: "line",
          parent: rootLocation._id,
          isActive: true,
          isLeaf: false,
        });
        totalCreated++;
        lineCount++;
        
        // Add line to parent's children
        rootLocation.children.push(line._id);
        console.log(`      ├─ Line: ${line.name} (${line.code})`);

        // Create machines for this line
        if (lineItem.machines && lineItem.machines.length > 0) {
          for (const machineItem of lineItem.machines) {
            const machine = await Location.create({
              name: machineItem.name,
              code: machineItem.code,
              type: "machine",
              parent: line._id,
              isLeaf: true,
              isActive: true,
            });
            totalCreated++;
            machineCount++;
            
            // Add machine to line's children
            line.children.push(machine._id);
          }
          await line.save();
          console.log(`      │  └─ Created ${lineItem.machines.length} machines`);
        }
      }
      
      await rootLocation.save();
      console.log("");
    }

    console.log("========================================");
    console.log("  🎉 Seeding Completed Successfully!");
    console.log("========================================\n");
    console.log(`📊 Summary:`);
    console.log(`   Total items created: ${totalCreated}`);
    console.log(`   ├─ Locations: ${locationCount}`);
    console.log(`   ├─ Lines: ${lineCount}`);
    console.log(`   └─ Machines: ${machineCount}\n`);
    
    console.log("📋 Location hierarchy:");
    locationData.forEach(loc => {
      const totalMachines = loc.lines.reduce((sum, line) => sum + (line.machines?.length || 0), 0);
      console.log(`   ${loc.name}`);
      console.log(`   ├─ ${loc.lines.length} lines`);
      console.log(`   └─ ${totalMachines} machines`);
    });

  } catch (error) {
    console.error("\n❌ Error seeding locations:", error);
    console.error(error.stack);
  } finally {
    await mongoose.connection.close();
    console.log("\n✅ Database connection closed");
    process.exit(0);
  }
}

// Run the seeder
seedLocations();
