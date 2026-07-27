
# Ubuntu Health Clinic — Web Application

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)

A modern, responsive Single-Page Application (SPA) developed for **Ubuntu Health Clinic**. Built with vanilla HTML5, CSS3, and JavaScript, this platform enables patients to explore medical services, register accounts, authenticate securely, and manage clinical appointments through an intuitive dashboard.

---

## Key Features

### Single-Page Architecture (SPA)
* Seamless view routing managed dynamically in JavaScript without page reloads.
* Clean separation of concern across Home, Services, About, Register, Login, Dashboard, and Confirmation views.

### Service Catalog & Smart Pre-selection
* Displays 8 core clinical services complete with service code identifiers and default durations:
  * **GP-01:** General Consultation (20 min)
  * **CH-02:** Chronic Medication (15 min)
  * **IM-03:** Immunisations (15 min)
  * **MC-04:** Maternal & Child Health (30 min)
  * **HT-05:** HIV/TB Screening (25 min)
  * **MH-06:** Mental Health Support (30 min)
  * **MP-07:** Minor Procedures (20 min)
  * **FP-08:** Family Planning (15 min)
* Selecting a service automatically preserves user intent and pre-selects the option in the booking form upon successful authentication.

### Authentication & Security Controls
* **In-Memory User Management:** Enforces registration validation before granting access to protected dashboard routes.
* **Credential Verification:** Validates user existence and password accuracy during authentication.
* **Interactive Password Toggle:** Built-in show/hide functionality for enhanced accessibility and UX on form inputs.

### Dynamic Appointment Dashboard (CRUD)
* **Create:** Book new clinical appointments with flexible date and time pickers.
* **Read:** Real-time visual list of scheduled appointments rendered alongside the booking form.
* **Update:** In-place modification of existing appointment details.
* **Delete:** Cancellation workflow with confirmation prompts.

---

## UI & Design System

* **Primary Palette:** Dominant Deep Purple (`#7c3aed`), Dark Slate (`#0f172a`), Card Background (`#1e293b`), and Light Purple Accents (`#a78bfa`).
* **Responsive Layout:** Grid and Flexbox architecture optimized for desktop, tablet, and mobile displays.

---

## Project Structure

```text
├── index.html                  # Core markup structure and component view templates
├── style.css                   # Custom CSS variables, component styles, and media queries
├── script.js                   # Application state management, SPA routing, and DOM logic
└── AdobeStock_305412791-scaled.jpeg  # Visual asset for hero section