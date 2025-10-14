# 📸 Snapshot Feature - Quick Reference

## What is a Snapshot?

A **snapshot** is a **read-only copy** of a LOTO that is automatically created when someone rejects a handover. It serves as a permanent record for the person who rejected it.

## When are Snapshots Created?

### ✅ **Scenario 1**: User rejects incoming handover
- You receive a handover request
- You click "Reject"
- **System creates**: Snapshot copy for you + Original returns to sender

### ✅ **Scenario 2**: Supervisor rejects handover
- You accepted a handover
- Supervisor rejects the verification
- **System creates**: Snapshot copy for you + Original returns to original sender

## How to Identify Snapshots

### In LOTO List:
```
Serial Number     Status
ABC-123 📸 SNAPSHOT    Rejected Handover (Snapshot)
```

### In LOTO Detail:
```
┌─────────────────────────────────────────────┐
│ 📸 READ-ONLY SNAPSHOT                       │
│                                             │
│ This is a snapshot of a LOTO that you      │
│ rejected. The original LOTO has been       │
│ returned to the previous responsible.      │
│                                             │
│ ⚠️ READ-ONLY - No actions available        │
└─────────────────────────────────────────────┘
```

## Snapshot Properties

| What You See | What It Means |
|-------------|---------------|
| 📸 **SNAPSHOT Badge** | This is a copy, not the original |
| 🔒 **No Action Buttons** | Cannot modify or perform actions |
| **Orange/Yellow Colors** | Visual indicator it's a snapshot |
| **Original LOTO ID** | Link to the active original LOTO |
| **Snapshot Created Date** | When the rejection occurred |

## What You CAN Do with Snapshots

✅ **View** all LOTO details (read-only)
✅ **Keep** for your records
✅ **Reference** the original LOTO ID
✅ **See** when and why it was rejected

## What You CANNOT Do with Snapshots

❌ **Edit** any information
❌ **Complete** the LOTO
❌ **Handover** to someone else
❌ **Update** status
❌ **Delete** (admin only)
❌ **Perform any actions**

## Why Snapshots Exist

1. **📝 Record Keeping**: You keep a record of what you rejected
2. **🔍 Audit Trail**: Clear history of who rejected what and when
3. **✅ Accountability**: Everyone can track handover decisions
4. **🛡️ Data Integrity**: Original LOTO continues unchanged

## Example Workflow

```
You: "I'm User B"

Step 1: User A hands over LOTO-123 to you
Step 2: You review it and click "Reject"
Step 3: System creates:
        ├─ LOTO-123 (Original) → Returns to User A ✅
        └─ LOTO-123-SNAPSHOT-xxx → Stays in your list 📸

Result:
- User A: Can see and work on LOTO-123 (Active)
- You: Can see LOTO-123-SNAPSHOT-xxx (Read-only)
```

## FAQs

**Q: Can I delete a snapshot?**
A: Only admins can delete snapshots. They are meant to be permanent records.

**Q: Will the snapshot update if the original LOTO changes?**
A: No, snapshots are frozen at the moment of rejection. They never change.

**Q: Can I hand over a snapshot to someone else?**
A: No, snapshots are read-only and cannot be modified or handed over.

**Q: How do I find the original LOTO?**
A: Click on the snapshot to view details. The "Original LOTO ID" field shows the active LOTO's ID.

**Q: What happens if I accept a handover instead?**
A: No snapshot is created. You become the new responsible person for the original LOTO.

**Q: Do snapshots count towards my active LOTOs?**
A: No, snapshots are separate and have their own status "rejected_handover_snapshot".

## Visual Indicators Summary

| Indicator | Meaning |
|-----------|---------|
| 📸 | Snapshot badge |
| 🔒 | Actions locked |
| ⚠️ | Warning/Important info |
| 🟡 Orange/Yellow | Snapshot colors |
| ✅ Green | Active/Editable LOTO |

---

**Remember**: Snapshots are **your personal record** of rejected handovers. They cannot be modified, ensuring data integrity and audit compliance.






