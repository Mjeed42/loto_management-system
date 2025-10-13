// ===================================================================
// ADD THIS CODE TO handoverVerificationController.js
// Location: In the verifyHandover function, in the "approve" branch
// Around line 306-333 (in the "else" block after "if (action === 'reject')")
// ===================================================================

    } else {
      // If approved, handover is complete - update status and responsible
      
      // STEP 1: Delete any old handover snapshots from sender (clean up)
      try {
        const existingHandoverSnapshots = await LOTO.find({
          originalLotoId: loto._id,
          snapshotCreatedFor: handover.fromUser,
          isSnapshot: true,
          snapshotReason: "handover_completed_sender_copy"
        });
        
        if (existingHandoverSnapshots.length > 0) {
          await LOTO.deleteMany({
            _id: { $in: existingHandoverSnapshots.map(s => s._id) }
          });
          console.log(`🗑️ Deleted ${existingHandoverSnapshots.length} old handover snapshot(s) for ${handover.fromUserName}`);
        }
      } catch (cleanupError) {
        console.error("❌ Error cleaning up old handover snapshots:", cleanupError);
        // Continue even if cleanup fails
      }
      
      // STEP 2: Create snapshot for SENDER (User A who handed it over)
      const senderSnapshotData = loto.toObject();
      delete senderSnapshotData._id;
      delete senderSnapshotData.__v;
      
      // Generate readable serial number
      const timestamp = new Date().toISOString().split('T')[0];
      const senderInitials = handover.fromUserName.split(' ').map(n => n[0]).join('');
      
      // Modify snapshot to be read-only
      senderSnapshotData.isSnapshot = true;
      senderSnapshotData.originalLotoId = loto._id;
      senderSnapshotData.snapshotReason = "handover_completed_sender_copy";
      senderSnapshotData.snapshotCreatedAt = new Date();
      senderSnapshotData.snapshotCreatedFor = handover.fromUser;  // Sender (User A)
      senderSnapshotData.snapshotCreatedForName = handover.fromUserName;
      senderSnapshotData.status = "handed_over_snapshot";
      senderSnapshotData.serialNumber = `${loto.serialNumber}-HANDOVER-${senderInitials}-${timestamp}`;
      // DON'T set currentResponsible on snapshots
      senderSnapshotData.currentResponsible = null;
      senderSnapshotData.currentResponsibleName = null;
      
      try {
        const senderSnapshot = new LOTO(senderSnapshotData);
        await senderSnapshot.save();
        console.log(`📤 Handover snapshot created for ${handover.fromUserName}: ${senderSnapshot.serialNumber}`);
      } catch (snapshotError) {
        console.error("❌ Error creating sender handover snapshot:", snapshotError);
        // Continue with the handover even if snapshot fails
      }
      
      // STEP 3: Transfer original LOTO to User B (recipient)
      loto.status = "active"; // Return to active status with new owner
      loto.currentResponsible = handover.toUser;
      loto.currentResponsibleName = handover.toUserName;
      
      // Clear handover fields since handover is complete
      loto.handoverTo = null;
      loto.handoverNotes = null;
      
      // STEP 4: Delete any previous rejection snapshots this user has for this LOTO
      // (in case they rejected before, then accepted, and now it's approved)
      try {
        const deletedRejectionSnapshots = await LOTO.deleteMany({
          originalLotoId: loto._id,
          snapshotCreatedFor: handover.toUser,
          isSnapshot: true,
          snapshotReason: { $in: ["handover_rejected_by_recipient", "handover_rejected_by_supervisor"] }
        });
        
        if (deletedRejectionSnapshots.deletedCount > 0) {
          console.log(`🗑️ Deleted ${deletedRejectionSnapshots.deletedCount} old rejection snapshot(s) - ${handover.toUserName} handover approved`);
        }
      } catch (cleanupError) {
        console.error("❌ Error cleaning up old rejection snapshots:", cleanupError);
        // Continue even if cleanup fails
      }
    }

// ===================================================================
// SUMMARY OF CHANGES:
// 1. Added cleanup of old handover snapshots from sender
// 2. Create new handover snapshot for sender with "handed_over_snapshot" status
// 3. Serial number format: LOTO-123-HANDOVER-AA-2025-01-12
// 4. Also delete any rejection snapshots from recipient (if they rejected before)
// ===================================================================




