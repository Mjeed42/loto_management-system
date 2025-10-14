# 📸 Handover Sender Snapshot Feature

## 🎯 **Feature Request**

When User A hands over a LOTO to User B, User A should also get a **snapshot** (read-only copy) to keep a record of what they handed over. This serves as a "before handover" record since the LOTO may change under the new responsible person.

## 💡 **Why This Is Needed**

### **Current Problem:**
```
User A hands over LOTO-123 to User B
User B accepts and makes changes (adds notes, updates times, etc.)
User A has NO RECORD of what the LOTO looked like when they handed it over
```

### **With Sender Snapshot:**
```
User A hands over LOTO-123 to User B
User A gets: LOTO-123-SNAPSHOT-HANDEDOVER-AA-2025-01-12
User B accepts and makes changes
User A can still see: What the LOTO looked like when they handed it over ✅
```

## 📊 **When to Create Snapshots**

### **Scenario 1: Recipient Accepts + Supervisor Approves**
```
1. User A hands over to User B
2. User B accepts
3. Supervisor approves
   → Create snapshot for User A (sender)
   → Transfer LOTO to User B
```

### **Scenario 2: Recipient Rejects** (Already Implemented)
```
1. User A hands over to User B
2. User B rejects
   → Create snapshot for User B (recipient who rejected)
   → Return LOTO to User A
```

### **Scenario 3: Supervisor Rejects** (Already Implemented)
```
1. User A hands over to User B
2. User B accepts
3. Supervisor rejects
   → Create snapshot for User B (recipient)
   → Return LOTO to User A
```

## 🔧 **Implementation Plan**

### **Step 1: Create Snapshot on Successful Handover**

**When:** Supervisor approves handover (Line ~306-333 in handoverVerificationController.js)

**Logic:**
```javascript
if (action === "approve") {
  // 1. Create snapshot for the SENDER (User A)
  const senderSnapshotData = loto.toObject();
  delete senderSnapshotData._id;
  delete senderSnapshotData.__v;
  
  const timestamp = new Date().toISOString().split('T')[0];
  const senderInitials = handover.fromUserName.split(' ').map(n => n[0]).join('');
  
  senderSnapshotData.isSnapshot = true;
  senderSnapshotData.originalLotoId = loto._id;
  senderSnapshotData.snapshotReason = "handover_completed_sender_copy";
  senderSnapshotData.snapshotCreatedAt = new Date();
  senderSnapshotData.snapshotCreatedFor = handover.fromUser;  // User A
  senderSnapshotData.snapshotCreatedForName = handover.fromUserName;
  senderSnapshotData.status = "handed_over_snapshot";  // New status
  senderSnapshotData.serialNumber = `${loto.serialNumber}-HANDOVER-${senderInitials}-${timestamp}`;
  senderSnapshotData.currentResponsible = null;
  senderSnapshotData.currentResponsibleName = null;
  
  const senderSnapshot = new LOTO(senderSnapshotData);
  await senderSnapshot.save();
  
  // 2. Transfer original LOTO to User B
  loto.status = "active";
  loto.currentResponsible = handover.toUser;
  loto.currentResponsibleName = handover.toUserName;
}
```

### **Step 2: Add New Status to Model**

**File:** `backend/src/models/LOTO.js`

**Add to status enum:**
```javascript
status: {
  type: String,
  enum: [
    "pending_verification_new",
    "active",
    "pending_handover_verification",
    "handed_over",
    "completed",
    "rejected",
    "rejected_handover_snapshot",    // Existing
    "handed_over_snapshot",          // NEW: Sender's handover record
  ],
  default: "pending_verification_new",
}
```

### **Step 3: Update snapshotReason Enum**

**File:** `backend/src/models/LOTO.js`

```javascript
snapshotReason: {
  type: String,
  enum: [
    "handover_rejected_by_recipient",
    "handover_rejected_by_supervisor",
    "handover_completed_sender_copy",  // NEW
  ],
}
```

### **Step 4: Update Frontend Status Display**

**File:** `frontend/src/pages/LOTOList.js`

**Add to status config:**
```javascript
handed_over_snapshot: {
  text: "Handed Over (Snapshot)",
  variant: "info",
  icon: "📤",
  color: "#3b82f6",
},
```

### **Step 5: Update Snapshot Banner**

**File:** `frontend/src/pages/LOTOdetail.js`

**Update snapshot banner to show different messages:**
```javascript
{loto.snapshotReason === 'handover_completed_sender_copy' 
  ? 'This is a snapshot of the LOTO you handed over. The original is now with the new responsible person.'
  : 'This is a snapshot of a LOTO handover that was rejected...'}
```

## 📋 **Complete User Experience**

### **Example: User A hands over to User B (Successful)**

```
Day 1: User A hands over LOTO-123 to User B

Day 2: User B accepts

Day 3: Supervisor approves
       ├─ 📤 LOTO-123-HANDOVER-AA-2025-01-03 → Snapshot for User A
       └─ ✅ LOTO-123 → Transfer to User B (active)

Day 10: User B makes changes to LOTO-123

Result:
┌─────────────────────────────────────────────────────────┐
│ User A's List:                                          │
│ 📤 LOTO-123-HANDOVER-AA-2025-01-03                     │
│    Status: Handed Over (Snapshot)                       │
│    Shows: LOTO as it was when User A handed it over    │
│    Read-only: User A can't modify it                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ User B's List:                                          │
│ ✅ LOTO-123                                            │
│    Status: Active                                       │
│    Current Responsible: User B                          │
│    Can: Edit, Complete, Handover again                 │
└─────────────────────────────────────────────────────────┘
```

### **Example: User A hands over to User B (Rejected)**

```
Day 1: User A hands over LOTO-123 to User B

Day 2: User B rejects

Result:
┌─────────────────────────────────────────────────────────┐
│ User A's List:                                          │
│ ✅ LOTO-123 (Active, can work on it)                  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ User B's List:                                          │
│ 📸 LOTO-123-SNAPSHOT-BA-2025-01-02                     │
│    Status: Rejected Handover (Snapshot)                 │
│    Shows: LOTO that User B rejected                    │
│    Read-only: For records only                         │
└─────────────────────────────────────────────────────────┘
```

## 📊 **Complete Snapshot Matrix**

| Scenario | Sender (User A) Gets | Recipient (User B) Gets |
|----------|---------------------|------------------------|
| **User B Rejects** | ✅ Original LOTO (active) | 📸 Rejection Snapshot (read-only) |
| **Supervisor Rejects** | ✅ Original LOTO (active) | 📸 Rejection Snapshot (read-only) |
| **Handover Approved** | 📤 Handover Snapshot (read-only) | ✅ Original LOTO (active) |

## 🎨 **Visual Indicators**

### **Snapshot Badges:**
- 📸 **Rejection Snapshot** - Orange/Yellow (User rejected handover)
- 📤 **Handover Snapshot** - Blue (User successfully handed over)

### **Status Colors:**
- 📸 `rejected_handover_snapshot` - Orange (#f59e0b)
- 📤 `handed_over_snapshot` - Blue (#3b82f6)

## 🔄 **Smart Management Rules**

### **Rule 1: Replace Old Handover Snapshots**

If User A hands over the same LOTO to User B multiple times (and it's approved):
```javascript
// Before creating new handover snapshot
const existingHandoverSnapshots = await LOTO.find({
  originalLotoId: loto._id,
  snapshotCreatedFor: handover.fromUser,
  snapshotReason: "handover_completed_sender_copy"
});

if (existingHandoverSnapshots.length > 0) {
  await LOTO.deleteMany({
    _id: { $in: existingHandoverSnapshots.map(s => s._id) }
  });
}
```

### **Rule 2: Delete Handover Snapshots When User Gets LOTO Back**

If User A hands over to User B, then later User B hands over BACK to User A:
```javascript
// When User A accepts handover back
const deletedSnapshots = await LOTO.deleteMany({
  originalLotoId: loto._id,
  snapshotCreatedFor: req.user.id,
  snapshotReason: "handover_completed_sender_copy"
});
```

## 🎯 **Benefits**

1. **📋 Complete Audit Trail**
   - Every handover has before/after snapshots
   - Clear record of what was handed over

2. **🛡️ Accountability**
   - User A has proof of LOTO state when handed over
   - User B can't claim "it was already wrong"

3. **📊 Historical Reference**
   - Compare current state vs. when handed over
   - Track changes made by new responsible person

4. **🔍 Dispute Resolution**
   - If issues arise, can refer to handover snapshot
   - Clear evidence of LOTO condition at handover

5. **📈 Analytics**
   - Track how LOTOs change ownership
   - Analyze handover patterns

## 📝 **Serial Number Format**

### **Rejection Snapshots:**
```
LOTO-123-SNAPSHOT-BA-2025-01-12
        ↓         ↓      ↓
    Original  Initials Date
```

### **Handover Snapshots:**
```
LOTO-123-HANDOVER-AA-2025-01-12
        ↓         ↓      ↓
    Original  Initials Date
```

**Benefits:**
- Easy to identify snapshot type (SNAPSHOT vs HANDOVER)
- Clear who it belongs to (initials)
- When it was created (date)

## 🚀 **Implementation Steps**

1. ✅ Update LOTO model (add new status and snapshotReason)
2. ✅ Implement sender snapshot creation in handoverVerificationController
3. ✅ Add smart cleanup logic (delete old handover snapshots)
4. ✅ Update frontend status display
5. ✅ Update snapshot banner messages
6. ✅ Test all scenarios
7. ✅ Deploy

## 📋 **Testing Checklist**

- [ ] User A hands over to User B, B accepts, supervisor approves
  - [ ] User A gets handover snapshot (📤)
  - [ ] User B gets active LOTO
  - [ ] Snapshot shows LOTO state at handover time

- [ ] User A hands over to User B twice (both approved)
  - [ ] Old handover snapshot deleted
  - [ ] Only latest handover snapshot exists

- [ ] User A hands over to User B, B hands back to A
  - [ ] User A's old handover snapshot deleted when they accept it back

- [ ] Multiple users in chain: A → B → C
  - [ ] User A has handover snapshot when handed to B
  - [ ] User B has handover snapshot when handed to C
  - [ ] User C has active LOTO

---

**Status:** 📋 **READY TO IMPLEMENT**
**Priority:** ⭐⭐⭐ High - Enhances audit trail and accountability
**Complexity:** Medium - Similar to existing rejection snapshot logic







