# Plant Owner Flow – Add Plant & Share Household
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

## Screens Overview

```
Household Overview (Owner)
→ Add Plant Modal – Step 1 (method selection)
    → Camera Screen          (intelligent path)
    → Add Plant Form         (both paths converge here)
        → Plant Added View
```

---

## 1. Household Overview (Owner)

### Purpose

Entry point of this flow. Shows the current state of the household from the plant owner's perspective.

### Must Display

✔ List of plants in the household (exactly one plant, in a happy/OK state)
✔ Each plant item shows: image, plant name, status badge (**OK**)
✔ Plant items are **not** clickable links (not the flow being tested)
✔ A prominent **"Add plant"** button

### Navigation

Click **"Add plant"** → **Add Plant Modal – Step 1**

### Simplifications

- Exactly one plant shown, always in a healthy state
- No back button needed (this is the flow entry point)
- No watering urgency cues

---

## 2. Add Plant Modal – Step 1 (Method Selection)

### Purpose

Asks the user how they want to identify and add the new plant.

### Must Display

✔ A clear heading, e.g. *"How do you want to add the plant?"*
✔ Two options presented as buttons or selectable cards:
  - **"Add intelligently"** – uses camera to identify the plant
  - **"Add manually"** – skips identification, goes straight to the form

### Navigation

Click **"Add intelligently"** → **Camera Screen**
Click **"Add manually"** → **Add Plant Form** (Step 2)

### Simplifications

- Modal can be implemented as a separate full screen
- No cancel / close button required

---

## 3. Camera Screen

### Purpose

Simulates the device camera opening so the user can take a photo of the plant.

### Must Display

✔ A camera viewfinder placeholder (static image or grey box is sufficient)
✔ A **"Take photo"** button

### Behavior

- The photo does **not** need to be saved or processed
- Pressing **"Take photo"** is the only required action; it immediately navigates forward

### Navigation

Click **"Take photo"** → **Add Plant Form** (Step 2)

### Simplifications

- No actual camera API required
- No retake / cancel flow

---

## 4. Add Plant Form (Step 2)

### Purpose

Displays a pre-filled form representing the plant data identified (or entered) by the user.

### Must Display

✔ Image of the plant at the top – use `plant_water.png`
✔ Pre-filled input fields (editable) for at minimum:

| Kenttä                             | Esitäytetty arvo                                                                                                    |
|------------------------------------|---------------------------------------------------------------------------------------------------------------------|
| Kasvin nimi                        | *Peikon lehti*                                                                                                      |
| Arvioitu kastelutiheys             | *7 päivän välein*                                                                                                   |
| Arvioitu kastelumäärä              | *2 dl*                                                                                                              |
| Muistiinpanot                      | *Viihtyy epäsuorassa valossa*                                                                                       |
| Kasvin koko (cm)                   | *45*                                                                                                                |
| Ruukun koko (litraa)               | *3*                                                                                                                 |
| Kastelutapa (pudotusvalikko)       | Vaihtoehdot: *Anna maan kuivua*, *Pidä maa jatkuvasti kosteana*, *Kastele runsaasti ja anna kuivua*, *Pohjakastelu* |

✔ A disclaimer text below the form, e.g.:
> *The final watering frequency will be determined by these guidelines and the sensor data collected about the plant.*

✔ An **"Add plant"** button

### Navigation

Click **"Add plant"** → **Plant Added View**

### Simplifications

- Fields are pre-filled; user does not need to type anything to proceed
- No form validation required
- Dropdown can default to the first option

---

## 5. Plant Added View

### Purpose

Confirms the plant has been added. Mirrors the Household Overview but now shows two plants and includes a share link.

### Must Display

✔ List of plants in the household – now **two plants**, both in a happy/OK state
✔ Each plant item shows: image, plant name, status badge (**OK**)
✔ A share prompt, e.g. *"Share your household with a friend"*
✔ A link (or button styled as a link) pointing to the deployed URL of **Flow 1**

### Navigation

Share link → external URL of the Flow 1 deployment (opens in same or new tab)

### Simplifications

- Plant items are not clickable (same as screen 1)
- No back button required

---

## Interaction Design Rules

### Deterministic Navigation Table

| User Action                              | Navigates To                  |
|------------------------------------------|-------------------------------|
| Click "Add plant" (Household Overview)   | Add Plant Modal – Step 1      |
| Click "Add intelligently"                | Camera Screen                 |
| Click "Add manually"                     | Add Plant Form                |
| Click "Take photo"                       | Add Plant Form                |
| Click "Add plant" (form)                 | Plant Added View              |
| Click share link                         | Flow 1 deployment URL         |

No hidden state or branching logic beyond the table above.

---

## UX Optimisations for Prototype

### 1. Make the Two-Step Add Flow Clear

Use a visible step indicator or heading change between Step 1 (method selection) and Step 2 (form), so users know they are progressing.

### 2. Pre-filled Form Reduces Friction

All form fields must have realistic default values. The user should be able to press **"Add plant"** immediately without filling anything in.

### 3. Distinguish Owner View from Caretaker View

The Household Overview in this flow does not need clickable plant links. A subtle visual difference (e.g. an "owner" badge or no arrow/chevron on plant rows) is sufficient.

---

## Final Flow Summary

Household Overview (Owner)
→ Add Plant Modal – Step 1 (method selection)
→ Camera Screen *(intelligent path only)*
→ Add Plant Form (pre-filled, both paths)
→ Plant Added View (2 plants + share link → Flow 1)

---

## Design Intent

This is a **static interactive prototype**, not a production system.

Optimise for:

- Predictability
- Ease of modification
- Minimal logic
- Demo clarity
- Minimal UI