const mongoose = require("mongoose");
const Location = require("../src/models/Location");

// Use your MongoDB Atlas connection string
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://loto_app_user:6hsMKn4SwqFKpPtV@loto-cluster.e2qnwyn.mongodb.net/loto-app?retryWrites=true&w=majority";

// Location hierarchy based on your Excel file
const locationHierarchy = [
  {
    name: "Processing",
    code: "PKG",
    type: "location",
    children: [
      { name: "Line A", code: "DA01", type: "line" },
      { name: "Line B", code: "DB01", type: "line" },
      { name: "Line C", code: "GUCP07", type: "line" },
      { name: "Line D", code: "DD01", type: "line" },
      { name: "Multi Bag", code: "MP01", type: "line" },
    ],
  },
  {
    name: "WH-FG",
    code: "WH-FG",
    type: "location",
    children: [],
  },
  {
    name: "WH-RM",
    code: "WH-RM",
    type: "location",
    children: [],
  },
  {
    name: "Project",
    code: "Project",
    type: "location",
    children: [],
  },
  {
    name: "Other",
    code: "Other",
    type: "location",
    children: [],
  },
];

// Process hierarchy to create locations
async function createLocations() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB Atlas");

    // Clear existing locations
    await Location.deleteMany({});
    console.log("Cleared existing locations");

    // Create locations recursively
    const createdLocations = [];

    for (const locationData of locationHierarchy) {
      try {
        // Create parent location
        const parentLocation = await Location.create({
          name: locationData.name,
          code: locationData.code,
          type: locationData.type,
          isLeaf: locationData.children.length === 0,
          description: locationData.description || "",
        });

        createdLocations.push(parentLocation);
        console.log(
          `Created parent location: ${parentLocation.name} (${parentLocation.code})`
        );

        // Create child locations
        for (const childData of locationData.children) {
          try {
            const childLocation = await Location.create({
              name: childData.name,
              code: childData.code,
              type: childData.type,
              parent: parentLocation._id,
              isLeaf: true,
              description: childData.description || "",
            });

            // Add child to parent's children array
            parentLocation.children.push(childLocation._id);
            await parentLocation.save();

            createdLocations.push(childLocation);
            console.log(
              `  Created child location: ${childLocation.name} (${childLocation.code}) under ${parentLocation.name}`
            );
          } catch (err) {
            console.error(
              `  Error creating child location ${childData.name}:`,
              err.message
            );
          }
        }
      } catch (err) {
        console.error(
          `Error creating parent location ${locationData.name}:`,
          err.message
        );
      }
    }

    console.log("All locations created successfully!");

    // Verify locations were created
    const locations = await Location.find().select(
      "name code type parent isLeaf children"
    );
    console.log("\nLocations in database:");
    locations.forEach((location) => {
      console.log(
        `  - ${location.name} (${location.code}) - Type: ${
          location.type
        } - Leaf: ${location.isLeaf} - Children: ${
          location.children?.length || 0
        }`
      );
    });

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

createLocations();
