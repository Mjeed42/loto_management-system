const mongoose = require('mongoose');
const LOTO = require('../models/LOTO');
const User = require('../models/User');
require('dotenv').config();

// MongoDB connection string from environment variable
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ ERROR: MONGODB_URI environment variable is not set!");
  console.error("Please set MONGODB_URI in your .env file");
  process.exit(1);
}

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function fixHandoverData() {
  try {
    console.log('🔧 Starting handover data fix...');
    
    // Find all LOTOs with handover history
    const lotos = await LOTO.find({ handoverHistory: { $exists: true, $ne: [] } })
      .populate('isolator', 'firstName lastName')
      .populate('handoverHistory.fromUser', 'firstName lastName')
      .populate('handoverHistory.toUser', 'firstName lastName')
      .populate('handoverHistory.createdBy', 'firstName lastName');

    console.log(`📊 Found ${lotos.length} LOTOs with handover history`);

    let fixedCount = 0;
    let errorCount = 0;
    let statusUpdatedCount = 0;

    for (const loto of lotos) {
      try {
        let needsUpdate = false;
        let statusNeedsUpdate = false;
        const updatedHandoverHistory = [];

        // Fix status if it's using old enum values
        if (loto.status === "pending") {
          loto.status = "pending_verification_new";
          statusNeedsUpdate = true;
          needsUpdate = true;
          console.log(`✅ Updated status for LOTO ${loto.serialNumber}: pending → pending_verification_new`);
        } else if (loto.status === "pending_handover") {
          loto.status = "pending_handover_verification";
          statusNeedsUpdate = true;
          needsUpdate = true;
          console.log(`✅ Updated status for LOTO ${loto.serialNumber}: pending_handover → pending_handover_verification`);
        }

        for (let i = 0; i < loto.handoverHistory.length; i++) {
          const handover = loto.handoverHistory[i];
          const updatedHandover = { ...handover.toObject() };

          // Fix fromUserName if it contains "undefined"
          if (!handover.fromUserName || handover.fromUserName.includes('undefined')) {
            if (handover.fromUser && handover.fromUser.firstName && handover.fromUser.lastName) {
              updatedHandover.fromUserName = `${handover.fromUser.firstName} ${handover.fromUser.lastName}`;
              needsUpdate = true;
              console.log(`✅ Fixed fromUserName for LOTO ${loto.serialNumber}, handover ${i + 1}: ${updatedHandover.fromUserName}`);
            } else if (i === 0 && loto.isolator) {
              // For first handover, use isolator as fromUser
              updatedHandover.fromUserName = `${loto.isolator.firstName} ${loto.isolator.lastName}`;
              updatedHandover.fromUser = loto.isolator._id;
              needsUpdate = true;
              console.log(`✅ Fixed fromUserName using isolator for LOTO ${loto.serialNumber}, handover ${i + 1}: ${updatedHandover.fromUserName}`);
            } else {
              console.log(`⚠️  Could not fix fromUserName for LOTO ${loto.serialNumber}, handover ${i + 1}`);
            }
          }

          // Fix toUserName if it contains "undefined"
          if (!handover.toUserName || handover.toUserName.includes('undefined')) {
            if (handover.toUser && handover.toUser.firstName && handover.toUser.lastName) {
              updatedHandover.toUserName = `${handover.toUser.firstName} ${handover.toUser.lastName}`;
              needsUpdate = true;
              console.log(`✅ Fixed toUserName for LOTO ${loto.serialNumber}, handover ${i + 1}: ${updatedHandover.toUserName}`);
            } else {
              console.log(`⚠️  Could not fix toUserName for LOTO ${loto.serialNumber}, handover ${i + 1}`);
            }
          }

          // Fix createdByName if it's "Unknown" or contains "undefined"
          if (!handover.createdByName || handover.createdByName === 'Unknown' || handover.createdByName.includes('undefined')) {
            if (handover.createdBy && handover.createdBy.firstName && handover.createdBy.lastName) {
              updatedHandover.createdByName = `${handover.createdBy.firstName} ${handover.createdBy.lastName}`;
              needsUpdate = true;
              console.log(`✅ Fixed createdByName for LOTO ${loto.serialNumber}, handover ${i + 1}: ${updatedHandover.createdByName}`);
            } else {
              console.log(`⚠️  Could not fix createdByName for LOTO ${loto.serialNumber}, handover ${i + 1}`);
            }
          }

          // Add missing recipient status fields for new two-step workflow
          if (!updatedHandover.recipientStatus) {
            updatedHandover.recipientStatus = "pending";
            needsUpdate = true;
            console.log(`✅ Added recipientStatus for LOTO ${loto.serialNumber}, handover ${i + 1}`);
          }

          updatedHandoverHistory.push(updatedHandover);
        }

        // Update the LOTO if changes were made
        if (needsUpdate) {
          const updateData = {
            handoverHistory: updatedHandoverHistory
          };
          
          if (statusNeedsUpdate) {
            updateData.status = loto.status;
            statusUpdatedCount++;
          }

          await LOTO.findByIdAndUpdate(loto._id, updateData);
          fixedCount++;
          console.log(`✅ Updated LOTO ${loto.serialNumber}`);
        }

      } catch (error) {
        errorCount++;
        console.error(`❌ Error processing LOTO ${loto.serialNumber}:`, error.message);
      }
    }

    console.log(`\n🎉 Migration completed!`);
    console.log(`✅ Fixed: ${fixedCount} LOTOs`);
    console.log(`📊 Status updated: ${statusUpdatedCount} LOTOs`);
    console.log(`❌ Errors: ${errorCount} LOTOs`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the migration
fixHandoverData();
