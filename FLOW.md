# Improved Prototype Application Flow  
**Architecture:** Static Prototype (Vite + HTML Screens + TypeScript + page.js)

---

## Prototype Philosophy

This prototype is **state-illusion based**, not state-driven.

- No real data mutations
- No persistence required
- Navigation simulates state transitions
- Each visual state = separate static screen
- Buttons navigate between predefined routes

Primary goal: **clarity, predictability, minimal logic**

---

## 1. Select Household

### Purpose
Entry point of the prototype.

### Behavior
- Displays list of households
- For prototype: **exactly one household**
- Entire household row/card is clickable

### Navigation
Click household → **Household Overview**

### Simplifications
- No empty states
- No filtering/search
- No management actions

Optional helper text:

> Valitse talous, jonka kasveista huolehdit

---

## 2. Household Overview

Core decision hub of the prototype.

### Must Display

✔ Next watering information (primary focus)  
✔ Plant list with recognisable images  
✔ Clear plant status indicators  

Each plant item includes:

- Image
- Plant name
- Status badge (Needs watering / OK)

Click plant → **Plant Overview**

---

### Static Variants (Required)

#### Variant A – Happy State
- Message: "Next watering in 7 days"
- All plants marked **OK / Healthy**
- No urgency cues

---

#### Variant B – Attention State
- Message: "Watering due today"
- Exactly one plant marked **Needs watering**
- Visual urgency indicator

---

### Navigation Rules

Back → **Select Household**

Navigation must never depend on hidden logic.

---

## 3. Plant Overview

Represented via three static states.

---

### State 1 – Needs Watering

Displayed for thirsty plant.

Must show:

✔ Plant image  
✔ Status: "Needs watering"  
✔ Optional care hint  

Primary Action:

`Mark as watered`

Behavior → Navigate to **State 2 – Watered**

Secondary Action:

`Back` → Household Overview (Attention Variant)

---

### State 2 – Watered

Represents successful care action.

Must show:

✔ Same plant image  
✔ Status: "Watered / Healthy"  
✔ Reassuring feedback  

Button:

`Back to household`

Behavior → Household Overview (Happy Variant)

---

### State 3 – Does Not Need Watering

For healthy plants.

Must show:

✔ Plant image  
✔ Status: "Does not need watering"

Optional disabled button:

`Water plant (disabled)`

Back → Household Overview (same variant)

---

## Interaction Design Rules

## Deterministic Navigation Logic

| User Action | Result |
|-------------|--------|
Click thirsty plant | Plant State 1 |
Click healthy plant | Plant State 3 |
Water plant | Plant State 2 |
Back from State 2 | Household Happy Variant |
Back from State 1 (no watering) | Household Attention Variant |

No hidden state or branching logic.

---

## UX Optimisations for Prototype

### 1. Make Status Immediately Obvious

Use strong visual cues:

- 🟢 OK / Healthy
- 🔴 Needs watering

---

### 2. Reinforce Cause → Effect

Household messaging must visibly change after watering.

Before:

> Watering due today

After:

> Next watering in 7 days

---

### 3. Keep Logic Emotionally Neutral

Users only perceive:

✔ Did my action change something?  
✔ Does navigation make sense?

Avoid complex conditional flows.

---

## Final Flow Summary

Select Household  
→ Household Overview (Happy OR Attention)  
→ Plant Overview (Three Static States)  
→ Deterministic Screen Transitions

---

## Design Intent

This is a **static interactive prototype**, not a production system.

Optimise for:

- Predictability
- Ease of modification
- Minimal logic
- Demo clarity
- Minimal UI
