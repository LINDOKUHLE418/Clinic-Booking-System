import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// DOM Elements
const welcomeChoice = document.getElementById("welcomeChoice");
const authTabs = document.getElementById("authTabs");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const bookingForm = document.getElementById("bookingForm");
const statusMessage = document.getElementById("statusMessage");

const btnNewPatient = document.getElementById("btnNewPatient");
const btnReturningPatient = document.getElementById("btnReturningPatient");

const tabLogin = document.getElementById("tabLogin");
const tabRegister = document.getElementById("tabRegister");
const tabBook = document.getElementById("tabBook");

// View switching helper
function showSection(sectionToShow) {
  [loginForm, registerForm, bookingForm].forEach(form => form.classList.add("hidden"));
  sectionToShow.classList.remove("hidden");
  statusMessage.textContent = "";
}

function updateTabState(activeTab) {
  [tabLogin, tabRegister, tabBook].forEach(tab => tab.classList.remove("active"));
  activeTab.classList.add("active");
}

// Event Listeners for Choice Screen
btnNewPatient.addEventListener("click", () => {
  welcomeChoice.classList.add("hidden");
  authTabs.classList.remove("hidden");
  showSection(registerForm);
  updateTabState(tabRegister);
});

btnReturningPatient.addEventListener("click", () => {
  welcomeChoice.classList.add("hidden");
  authTabs.classList.remove("hidden");
  showSection(loginForm);
  updateTabState(tabLogin);
});

// Tab Switchers
tabLogin.addEventListener("click", () => {
  showSection(loginForm);
  updateTabState(tabLogin);
});

tabRegister.addEventListener("click", () => {
  showSection(registerForm);
  updateTabState(tabRegister);
});

tabBook.addEventListener("click", () => {
  showSection(bookingForm);
  updateTabState(tabBook);
});

// Registration Handling
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  try {
    statusMessage.textContent = "Creating account...";
    statusMessage.className = "status-message";
    await createUserWithEmailAndPassword(auth, email, password);
    
    statusMessage.textContent = "Account registered successfully! Proceeding to booking...";
    statusMessage.className = "status-message success";
    registerForm.reset();

    setTimeout(() => {
      showSection(bookingForm);
      updateTabState(tabBook);
    }, 1500);
  } catch (error) {
    statusMessage.textContent = error.message;
    statusMessage.className = "status-message error";
  }
});

// Login Handling
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    statusMessage.textContent = "Logging in...";
    statusMessage.className = "status-message";
    await signInWithEmailAndPassword(auth, email, password);
    
    statusMessage.textContent = "Logged in successfully!";
    statusMessage.className = "status-message success";
    loginForm.reset();

    setTimeout(() => {
      showSection(bookingForm);
      updateTabState(tabBook);
    }, 1500);
  } catch (error) {
    statusMessage.textContent = "Invalid login credentials.";
    statusMessage.className = "status-message error";
  }
});

// Booking Submission
bookingForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = auth.currentUser;

  const appointmentData = {
    clinic: "Ubuntu Health Clinic",
    patientEmail: user ? user.email : "Guest",
    department: document.getElementById("doctorType").value,
    date: document.getElementById("bookingDate").value,
    time: document.getElementById("bookingTime").value,
    createdAt: new Date()
  };

  try {
    statusMessage.textContent = "Submitting booking...";
    statusMessage.className = "status-message";

    await addDoc(collection(db, "appointments"), appointmentData);

    statusMessage.textContent = "Appointment booked successfully!";
    statusMessage.className = "status-message success";
    bookingForm.reset();
  } catch (error) {
    statusMessage.textContent = "Failed to book appointment. Please try again.";
    statusMessage.className = "status-message error";
  }
});