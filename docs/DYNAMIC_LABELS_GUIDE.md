# 🏷️ Dynamic Labels in CreateLOTO - Complete Guide

## ✅ Feature Complete

The CreateLOTO form now automatically uses custom labels from your LocationManagement settings!

---

## 🎯 How It Works

### **Example: Your Scenario**

#### **In LocationManagement**
You set up:
```
MJEED (Location)
  └─ KK (typeLabel: "Department")
       └─ NOONE (typeLabel: "Machine")
```

#### **In CreateLOTO**
Form automatically shows:
```
Primary Location: MJEED
Department:      KK          ← Uses custom label!
Machine:         NOONE       ← Uses custom label!

Selected Path: MJEED > KK > NOONE
```

---

## 📊 Before vs After

### **Before (Fixed Labels)**
```
CreateLOTO Form:
  Primary Location:    PKG
  Line/Part:          Line A     ← Always "Line/Part"
  Machine/Equipment:   DA01      ← Always "Machine/Equipment"
```

### **After (Dynamic Labels)**
```
CreateLOTO Form:
  Primary Location:  MJEED
  Department:       KK           ← Custom label from typeLabel!
  Machine:          NOONE        ← Custom label from typeLabel!
```

---

## 🔧 How to Set It Up

### **Step 1: Set Custom Labels in LocationManagement**

1. Go to **LocationManagement**
2. Click **Edit** on "KK" (the line)
3. Set **Custom Type Label** to "Department"
4. Click **Update**

```
┌────────────────────────────────────────┐
│ ✏️ Edit Line Name                      │
├────────────────────────────────────────┤
│ New Name *                             │
│ [KK_____________]                      │
│                                        │
│ Custom Type Label (Optional)           │
│ [Department_____]  ← Set this!        │
│                                        │
│ [Cancel]                    [Update] ✓ │
└────────────────────────────────────────┘
```

5. Repeat for machines if needed:
   - Edit "NOONE"
   - Set **Custom Type Label** to "Machine" (or leave default)

### **Step 2: Use CreateLOTO**

1. Go to **CreateLOTO**
2. Select **Location**: MJEED
3. The next field will show **"Department"** instead of "Line/Part"
4. Select **Department**: KK
5. The next field will show **"Machine"** instead of "Machine/Equipment"
6. Select **Machine**: NOONE

---

## 🎨 Examples

### **Example 1: Warehouse with Departments**

#### **Setup**
```
WH-FG
├─ Receiving (typeLabel: "Department")
│  └─ Gate-01 (typeLabel: "Equipment")
└─ Shipping (typeLabel: "Department")
   └─ Dock-01 (typeLabel: "Equipment")
```

#### **CreateLOTO Shows**
```
Primary Location:  WH-FG
Department:       Receiving      ← Custom!
Equipment:        Gate-01        ← Custom!

Selected Path: WH-FG > Receiving > Gate-01
```

### **Example 2: Factory with Zones**

#### **Setup**
```
Factory
├─ Zone A (typeLabel: "Zone")
│  └─ Robot-01 (typeLabel: "Robot")
└─ Zone B (typeLabel: "Zone")
   └─ Robot-02 (typeLabel: "Robot")
```

#### **CreateLOTO Shows**
```
Primary Location:  Factory
Zone:             Zone A         ← Custom!
Robot:            Robot-01       ← Custom!

Selected Path: Factory > Zone A > Robot-01
```

### **Example 3: Traditional Production**

#### **Setup**
```
PKG
├─ Line A (typeLabel: "Production Line")
│  └─ DA01 (typeLabel: "Filler")
└─ Line B (typeLabel: "Production Line")
   └─ DB01 (typeLabel: "Filler")
```

#### **CreateLOTO Shows**
```
Primary Location:   PKG
Production Line:   Line A        ← Custom!
Filler:           DA01          ← Custom!

Selected Path: PKG > Line A > DA01
```

---

## 💻 Technical Details

### **How Labels Are Determined**

```javascript
// When lines are fetched for a location:
const fetchLinesForLocation = async (locationId) => {
  const res = await axios.get(`/api/locations/${locationId}/children`);
  const activeLines = res.data.data.filter(line => line.isActive !== false);
  
  // Get custom label from first line
  if (activeLines.length > 0 && activeLines[0].typeLabel) {
    setCurrentLineLabel(activeLines[0].typeLabel);  // "Department"
  } else {
    setCurrentLineLabel("Line/Part");  // Default
  }
};

// Same for machines:
const fetchMachinesForLine = async (lineId) => {
  const res = await axios.get(`/api/locations/${lineId}/children`);
  const activeMachines = res.data.data.filter(m => m.isActive !== false);
  
  if (activeMachines.length > 0 && activeMachines[0].typeLabel) {
    setCurrentMachineLabel(activeMachines[0].typeLabel);  // "Equipment"
  } else {
    setCurrentMachineLabel("Machine/Equipment");  // Default
  }
};
```

### **Label Sources**

1. **Primary Location**: Always "Primary Location" (hardcoded)
2. **Second Level**: Uses `typeLabel` from first child of selected location
3. **Third Level**: Uses `typeLabel` from first child of selected line

### **Fallback Behavior**

If no custom label is set:
- Second level: "Line/Part"
- Third level: "Machine/Equipment"

---

## 🔄 Real-Time Updates

Labels update dynamically when you change selections:

```
User selects Location: PKG
  → Fetches lines
  → Finds Line A has typeLabel: "Production Line"
  → Updates label to "Production Line"

User selects Production Line: Line A
  → Fetches machines
  → Finds DA01 has typeLabel: "Filler"
  → Updates label to "Filler"
```

---

## ⚠️ Important Notes

### **1. Consistent Labels**
All items at the same level should use the same typeLabel:
```
✅ GOOD:
   All lines under PKG use typeLabel: "Production Line"
   All machines under lines use typeLabel: "Filler"

❌ BAD:
   Line A: typeLabel "Production Line"
   Line B: typeLabel "Department"  ← Confusing!
```

### **2. Label Inheritance**
Labels come from the **first item** in the list:
- If items have different typeLabels, only the first one's label is used
- This encourages consistency

### **3. Empty typeLabel**
If typeLabel is empty or not set:
- Falls back to default ("Line/Part", "Machine/Equipment")
- This ensures the form always has labels

---

## 🧪 Testing Your Labels

### **Test Checklist**

1. **Set Custom Labels**
   - [x] Edit a line in LocationManagement
   - [x] Set typeLabel to "Department"
   - [x] Save

2. **Verify in CreateLOTO**
   - [x] Open CreateLOTO
   - [x] Select the parent location
   - [x] Verify second field shows "Department"
   - [x] Select a department
   - [x] Verify third field shows correct machine label

3. **Test Fallbacks**
   - [x] Create location without typeLabel
   - [x] Verify CreateLOTO shows default "Line/Part"

4. **Test Consistency**
   - [x] Set same typeLabel for all lines
   - [x] Verify label appears correctly in CreateLOTO

---

## 📝 Files Modified

### **Frontend**
- `frontend/src/pages/CreateLOTO.js`
  - Added `currentLineLabel` state
  - Added `currentMachineLabel` state
  - Updated `fetchLinesForLocation` to extract typeLabel
  - Updated `fetchMachinesForLine` to extract typeLabel
  - Replaced hardcoded labels with dynamic state variables
  - Updated placeholder text to use dynamic labels

---

## 🎯 Summary

**Your scenario now works perfectly:**

```
LocationManagement Setup:
  MJEED
    └─ KK (typeLabel: "Department")
         └─ NOONE (typeLabel: "Machine")

CreateLOTO Display:
  Primary Location: MJEED
  Department:      KK          ← Shows "Department"!
  Machine:         NOONE       ← Shows "Machine"!
  
  Selected Path: MJEED > KK > NOONE
```

**The labels in CreateLOTO now automatically match what you set in LocationManagement!** 🎉✨











