# Standardized Button Components

This document describes the standardized button components created for the LOTO Management System.

## Components Created

### 1. ActionButton Component (`/src/components/ActionButton.js`)

A modern, glassmorphic button component designed for header actions and primary navigation buttons.

**Features:**
- Glassmorphic design with backdrop blur
- Smooth hover animations
- Built-in SVG icons
- Two variants: `primary` and `secondary`
- Consistent styling across all pages

**Usage:**
```jsx
import ActionButton from '../components/ActionButton';

// Header action buttons
<ActionButton
  variant="secondary"
  onClick={handleRefresh}
  icon="refresh"
>
  Refresh
</ActionButton>

<ActionButton
  variant="primary"
  onClick={handleHome}
  icon="home"
>
  Home
</ActionButton>
```

**Available Icons:**
- `refresh` - Refresh/reload icon
- `back` - Back/return icon
- `home` - Home icon
- `save` - Save icon
- `edit` - Edit icon
- `delete` - Delete icon
- `add` - Add/plus icon
- `check` - Checkmark icon
- `cancel` - Cancel/X icon
- `settings` - Settings icon
- `users` - Users icon
- `list` - List icon
- `chart` - Chart icon
- `download` - Download icon

### 2. StandardButton Component (`/src/components/StandardButton.js`)

A standard button component for forms, tables, and general UI interactions.

**Features:**
- Uses cf- prefixed CSS classes
- Multiple variants: `primary`, `secondary`, `success`, `danger`, `warning`, `info`, `outline`
- Three sizes: `sm`, `md`, `lg`
- Built-in SVG icons
- Consistent with system design

**Usage:**
```jsx
import StandardButton from '../components/StandardButton';

// Form buttons
<StandardButton 
  type="submit" 
  variant="primary" 
  icon="save"
>
  Create User
</StandardButton>

<StandardButton
  type="button"
  variant="outline"
  icon="cancel"
  onClick={handleCancel}
>
  Cancel
</StandardButton>

// Table action buttons
<StandardButton 
  variant="outline"
  icon="refresh"
  onClick={handleRefresh}
>
  Refresh Users
</StandardButton>
```

## Implementation Status

### ✅ Completed
- Created ActionButton component with glassmorphic styling
- Created StandardButton component with cf- classes
- Updated AdminHome.js to use new button components
- Updated LOTOList.js header buttons to use ActionButton
- Updated LOTOList.js filter buttons to use StandardButton

### 🔄 In Progress
- Updating remaining buttons in LOTOList.js
- Updating other system pages

### 📋 Pending
- Update LOTOdetail.js to use new components
- Update CreateLOTO.js to use new components
- Update other system pages
- Create button style guide documentation

## Benefits

1. **Consistency**: All buttons now have the same modern, professional appearance
2. **Maintainability**: Centralized button styling makes updates easier
3. **Accessibility**: Built-in icons and proper button semantics
4. **Performance**: Reusable components reduce code duplication
5. **User Experience**: Smooth animations and clear visual hierarchy

## CSS Classes Used

The components utilize existing CSS classes from the design system:

**ActionButton:**
- `.action-btn` - Base button styling
- `.action-btn.primary` - Primary variant
- `.action-btn.secondary` - Secondary variant
- `.btn-icon` - Icon styling

**StandardButton:**
- `.cf-btn` - Base button styling
- `.cf-btn-sm`, `.cf-btn-lg` - Size variants
- `.cf-btn-primary`, `.cf-btn-secondary`, etc. - Color variants
- `.cf-btn-outline-secondary` - Outline variant

## Migration Guide

To migrate existing buttons to the new components:

1. **Header Actions**: Replace with `ActionButton`
   ```jsx
   // Old
   <button className="cf-btn cf-btn-sm cf-btn-outline-secondary" onClick={handleAction}>
     🔄 Refresh
   </button>
   
   // New
   <ActionButton variant="secondary" icon="refresh" onClick={handleAction}>
     Refresh
   </ActionButton>
   ```

2. **Form Buttons**: Replace with `StandardButton`
   ```jsx
   // Old
   <button className="cf-btn cf-btn-sm" type="submit">
     💾 Save
   </button>
   
   // New
   <StandardButton variant="primary" icon="save" type="submit">
     Save
   </StandardButton>
   ```

3. **Table Actions**: Replace with `StandardButton`
   ```jsx
   // Old
   <button className="cf-btn cf-btn-sm cf-btn-outline-secondary" onClick={handleAction}>
     ✏️ Edit
   </button>
   
   // New
   <StandardButton variant="outline" icon="edit" onClick={handleAction}>
     Edit
   </StandardButton>
   ```

This standardization ensures a consistent, modern, and professional appearance across all system pages.
