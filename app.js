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

// Pages
const welcomePage = document.getElementById("welcomePage");
const registerPage = document.getElementById("registerPage");
const loginPage = document.getElementById("loginPage");
const bookingPage = document.getElementById("bookingPage");
const confirmationPage = document.getElementById("confirmationPage");

// Forms & Elements
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const bookingForm = document.getElementById("bookingForm");
const statusMessage = document.getElementById("statusMessage");

// Navigation Buttons
const btnGoToLogin = document.getElementById("btnGoToLogin");
const btnGoToRegister = document.getElementById("btnGoToRegister");
const btnBackFromReg = document.getElementById("btnBackFromReg");
const btnBackFromLogin = document.getElementById("btnBackFromLogin");
const btnNewBooking = document.getElementById("btnNewBooking");

// Summary Elements
const summaryEmail = document.getElementById("summaryEmail");
const summaryDepartment = document.getElementById("summaryDepartment");
const summaryDate = document.getElementById("summaryDate");
const summaryTime = document.getElementById("summaryTime");

// Helper function to switch active page view
function goToPage(pageToShow) {
  [welcomePage, registerPage, loginPage, bookingPage, confirmationPage].forEach(page => page.classList.add("hidden"));
  pageToShow.classList.remove("hidden");
  statusMessage.textContent = "";
}

// Event Listeners for Navigation
btnGoToLogin.addEventListener("click", () => goToPage(loginPage));
btnGoToRegister.addEventListener("click", () => goToPage(registerPage));
btnBackFromReg.addEventListener("click", () => goToPage(welcomePage));
btnBackFromLogin.addEventListener("click", () => goToPage(welcomePage));

// Handle Registration -> Redirect back to Welcome Page
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  try {
    statusMessage.textContent = "Creating account...";
    statusMessage.className = "status-message";
    await createUserWithEmailAndPassword(auth, email, password);
    
    statusMessage.textContent = "Account created! Redirecting to Welcome Page to log in...";
    statusMessage.className = "status-message success";
    registerForm.reset();

    setTimeout(() => {
      goToPage(welcomePage);
    }, 1800);
  } catch (error) {
    statusMessage.textContent = error.message;
    statusMessage.className = "status-message error";
  }
});

// Handle Login -> Redirect to Booking Page
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    statusMessage.textContent = "Logging in...";
    statusMessage.className = "status-message";
    await signInWithEmailAndPassword(auth, email, password);
    
    statusMessage.textContent = "Logged in! Loading booking page...";
    statusMessage.className = "status-message success";
    loginForm.reset();

    setTimeout(() => {
      goToPage(bookingPage);
    }, 1200);
  } catch (error) {
    statusMessage.textContent = "Invalid email or password.";
    statusMessage.className = "status-message error";
  }
});

// Handle Booking Submission -> Redirect to Confirmation Page
bookingForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = auth.currentUser;

  const department = document.getElementById("doctorType").value;
  const date = document.getElementById("bookingDate").value;
  const time = document.getElementById("bookingTime").value;
  const email = user ? user.email : "Guest";

  const appointmentData = {
    clinic: "Ubuntu Health Clinic",
    patientEmail: email,
    department: department,
    date: date,
    time: time,
    createdAt: new Date()
  };

  try {
    statusMessage.textContent = "Submitting booking...";
    statusMessage.className = "status-message";

    await addDoc(collection(db, "appointments"), appointmentData);

    summaryEmail.textContent = email;
    summaryDepartment.textContent = department;
    summaryDate.textContent = date;
    summaryTime.textContent = time;

    bookingForm.reset();
    goToPage(confirmationPage);
  } catch (error) {
    statusMessage.textContent = "Failed to book appointment. Please try again.";
    statusMessage.className = "status-message error";
  }
});

// Start a new booking flow from Confirmation Page
btnNewBooking.addEventListener("click", () => {
  goToPage(welcomePage);
});