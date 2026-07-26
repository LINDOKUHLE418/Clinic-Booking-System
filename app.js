import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Replace placeholder credentials with your Firebase config parameters
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

const bookingForm = document.getElementById("bookingForm");
const statusMessage = document.getElementById("statusMessage");

bookingForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const appointmentData = {
    name: document.getElementById("patientName").value,
    email: document.getElementById("patientEmail").value,
    phone: document.getElementById("patientPhone").value,
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
    console.error("Error adding document: ", error);
    statusMessage.textContent = "Failed to book appointment. Please try again.";
    statusMessage.className = "status-message error";
  }
});
