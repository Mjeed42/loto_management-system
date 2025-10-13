# ✏️ Edit Line/Machine Names Feature

## ✅ Feature Complete

Administrators can now edit the names of Lines and Machines (but not root Locations) directly from the LocationManagement page. Changes automatically reflect in CreateLOTO dropdowns.

---

## 🎯 What You Can Edit

### ✅ **Editable:**
- **Lines** (e.g., "Line A", "Line B", "PC", "TC")
- **Machines** (e.g., "DA01", "DB05", "Chiller-01")

### ❌ **Not Editable:**
- **Root Locations** (e.g., "PKG", "Process", "Utility")
  - These are core system locations and should remain stable
  - If you need to change these, use the database directly

---

## 🎨 User Interface

### **Location Management View**

#### **Root Locations (No Edit Button)**
```
┌─────────────────────────────────────────────────┐
│ ▼  PKG                                          │
│    Type: LOCATION    Status: VISIBLE ✓          │
│    Actions: [+Add] [Hide] [Delete]              │
│                      ↑ No Edit button           │
└─────────────────────────────────────────────────┘
```

#### **Lines & Machines (With Edit Button)**
```
┌─────────────────────────────────────────────────┐
│    ▼  Line A                                    │
│       Type: LINE    Status: VISIBLE ✓           │
│       Actions: [+Add] [✏️Edit] [Hide] [Delete]  │
│                         ↑ Edit button           │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│       DA01                                      │
│       Type: MACHINE    Status: VISIBLE ✓        │
│       Actions: [✏️Edit] [Hide] [Delete]         │
│                  ↑ Edit button                  │
└─────────────────────────────────────────────────┘
```

---

## 📝 Edit Modal

When you click the Edit button on a Line or Machine:

```
┌────────────────────────────────────────────┐
│ ✏️ Edit Line Name                          │
├────────────────────────────────────────────┤
│                                            │
│ ℹ️ Note: Editing the name will update it  │
│ everywhere, including in CreateLOTO        │
│ dropdowns.                                 │
│                                            │
│ New Name *                                 │
│ ┌────────────────────────────────────────┐ │
│ │ Line A                                 │ │
│ └────────────────────────────────────────┘ │
│                                            │
│ Code *                                     │
│ ┌────────────────────────────────────────┐ │
│ │ LINE-A                                 │ │
│ └────────────────────────────────────────┘ │
│ This code is used in the system and       │
│ should be unique.                         │
│                                            │
├────────────────────────────────────────────┤
│ [Cancel]                      [Update] ✓   │
└────────────────────────────────────────────┘
```

---

## 🔄 How Name Changes Propagate

### **Example: Renaming "Line A" to "Production Line 1"**

#### **Before:**
```
LocationManagement:
  PKG
    └─ Line A
         ├─ DA01
         └─ DA02

CreateLOTO Dropdown:
  Location: PKG
  Line: Line A ← User sees this
  Machine: DA01
```

#### **After Editing:**
```
LocationManagement:
  PKG
    └─ Production Line 1 ← Updated!
         ├─ DA01
         └─ DA02

CreateLOTO Dropdown:
  Location: PKG
  Line: Production Line 1 ← Automatically updated!
  Machine: DA01
```

---

## 💻 Technical Implementation

### **Frontend Changes**

#### **1. Conditional Edit Button**
```javascript
// Only show edit button for lines and machines
{location.type !== "location" && (
  <ActionButton
    onClick={() => openEditModal(location)}
    variant="secondary"
    icon="edit"
    title="Edit name"
    disabled={isCreating || isUpdating || isDeleting}
  />
)}
```

#### **2. Dynamic Modal Title**
```javascript
<h2>
  {showEditModal 
    ? `Edit ${selectedLocation?.type === 'line' ? 'Line' : 'Machine'} Name` 
    : "Add New Location"}
</h2>
```

#### **3. Edit Form**
```javascript
{showEditModal && (
  <>
    {/* Info note */}
    <div className="info-note">
      Editing the name will update it everywhere, 
      including in CreateLOTO dropdowns.
    </div>
    
    {/* Name input */}
    <input
      value={formData.name}
      onChange={(e) => {
        const newName = e.target.value;
        setFormData({ 
          ...formData, 
          name: newName,
          code: newName.toUpperCase().replace(/[^A-Z0-9]/g, '-')
        });
      }}
      placeholder={`Enter new ${selectedLocation?.type} name`}
      autoFocus
    />
    
    {/* Code input */}
    <input
      value={formData.code}
      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
      placeholder="Auto-generated, but you can customize it"
    />
  </>
)}
```

### **Backend**

No changes needed! The existing `updateLocation` endpoint already handles name updates:

```javascript
// PUT /api/locations/:id
if (name) location.name = name;
if (code) location.code = code;
await location.save();
```

### **CreateLOTO Integration**

No changes needed! CreateLOTO already fetches fresh data from the API:

```javascript
// Automatically gets updated names
const fetchLinesForLocation = async (locationId) => {
  const res = await axios.get(`/api/locations/${locationId}/children`);
  const activeLines = res.data.data.filter(line => line.isActive !== false);
  setAvailableLines(activeLines); // Updated names appear here!
};
```

---

## 🔐 Restrictions

### **1. Root Locations Cannot Be Edited**
- **Reason**: These are core system locations (PKG, Process, Utility, etc.)
- **No Edit Button**: Root locations don't show the edit button
- **Stability**: Prevents accidental changes to critical system structure

### **2. Admin Only**
- Only users with admin role can edit names
- Backend validates: `req.user.role === "admin"`

### **3. Unique Names & Codes**
- Backend validates that name and code are unique
- Shows error if name/code already exists

---

## 📊 Use Cases

### **Use Case 1: Rename Production Line**
```
Scenario: "Line A" needs to be renamed to "Packaging Line A"
Steps:
1. Click Edit button on "Line A"
2. Change name to "Packaging Line A"
3. Code auto-updates to "PACKAGING-LINE-A"
4. Click Update
5. Name changes everywhere instantly
```

### **Use Case 2: Standardize Machine Names**
```
Scenario: Machine names need prefix for clarity
Steps:
1. Click Edit on "DA01"
2. Change to "Filler DA01"
3. Code auto-updates to "FILLER-DA01"
4. Repeat for all machines
5. All CreateLOTO dropdowns now show "Filler DA01"
```

### **Use Case 3: Fix Typo**
```
Scenario: "Chilller-01" has a typo
Steps:
1. Click Edit on "Chilller-01"
2. Change to "Chiller-01"
3. Code updates to "CHILLER-01"
4. Click Update
5. Typo fixed everywhere
```

---

## ⚠️ Important Notes

### **1. Changes Are Immediate**
- Name changes take effect immediately
- No need to refresh CreateLOTO page
- Next time dropdown is populated, new name appears

### **2. Affects Existing LOTOs**
- Existing LOTOs keep their old names (stored as text)
- Only new LOTOs will use the updated names
- This is by design to maintain historical accuracy

### **3. Code Changes**
- Code auto-generates from name
- Can be manually customized if needed
- Must be unique across all locations

### **4. Cannot Edit Root Locations**
- If you really need to change PKG, Process, etc.
- Must be done directly in database
- This protects critical system structure

---

## 🧪 Testing Checklist

- [x] Root locations (PKG, Process, etc.) do NOT show edit button
- [x] Lines show edit button
- [x] Machines show edit button
- [x] Clicking edit opens modal with current name
- [x] Modal title shows correct item type
- [x] Name input is auto-focused
- [x] Code auto-generates from name
- [x] Code can be manually edited
- [x] Update button saves changes
- [x] Success message shows after update
- [x] LocationManagement refreshes to show new name
- [x] CreateLOTO dropdowns show new name
- [x] Error shown if name already exists
- [x] Error shown if code already exists

---

## 📝 Files Modified

### **Frontend**
- `frontend/src/pages/LocationManagement.js`
  - Added conditional rendering for edit button
  - Updated modal title to be dynamic
  - Enhanced edit form with info note
  - Auto-focus on name input
  - Auto-generate code from name

### **Backend**
- No changes needed (already supports name updates)

### **CreateLOTO**
- No changes needed (already fetches fresh data)

---

**The edit name feature is now fully working!** 🎉✨

Users can easily rename Lines and Machines, and changes automatically appear in CreateLOTO dropdowns.
