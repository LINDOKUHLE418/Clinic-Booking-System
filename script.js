document.addEventListener("DOMContentLoaded", () => {
  // --- LOCAL STORAGE HELPERS ---
  const getUsers = () => JSON.parse(localStorage.getItem("ubuntu_users")) || [];
  const saveUsers = (users) => localStorage.setItem("ubuntu_users", JSON.stringify(users));

  const getCurrentUser = () => JSON.parse(localStorage.getItem("ubuntu_current_user"));
  const setCurrentUser = (user) => localStorage.setItem("ubuntu_current_user", JSON.stringify(user));
  const removeCurrentUser = () => localStorage.removeItem("ubuntu_current_user");

  const getAppointments = () => {
    let apps = JSON.parse(localStorage.getItem("ubuntu_appointments")) || [];
    // Automatically purge appointments older than today
    const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const activeApps = apps.filter(app => app.date >= todayStr);
    
    if (activeApps.length !== apps.length) {
      saveAppointments(activeApps);
    }
    return activeApps;
  };
  
  const saveAppointments = (apps) => localStorage.setItem("ubuntu_appointments", JSON.stringify(apps));

  // --- NAVIGATION ELEMENTS ---
  const pages = {
    welcome: document.getElementById("welcomePage"),
    services: document.getElementById("servicesPage"),
    about: document.getElementById("aboutPage"),
    register: document.getElementById("registerPage"),
    login: document.getElementById("loginPage"),
    booking: document.getElementById("bookingPage"),
    confirmation: document.getElementById("confirmationPage")
  };

  const navHome = document.getElementById("navHomeLink");
  const navServices = document.getElementById("navServicesLink");
  const navAbout = document.getElementById("navAboutLink");
  const navLoginBtn = document.getElementById("navLoginBtn");

  // --- PAGE SWITCHER ---
  function showPage(pageKey) {
    Object.keys(pages).forEach(key => {
      if (pages[key]) {
        pages[key].classList.add("hidden");
      }
    });
    if (pages[pageKey]) {
      pages[pageKey].classList.remove("hidden");
    }
    
    // Refresh header dynamic button state
    const currentUser = getCurrentUser();
    if (currentUser) {
      navLoginBtn.textContent = "Dashboard";
    } else {
      navLoginBtn.textContent = "Log In";
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Navigation Links
  navHome.addEventListener("click", (e) => { e.preventDefault(); showPage("welcome"); });
  navServices.addEventListener("click", (e) => { e.preventDefault(); showPage("services"); });
  navAbout.addEventListener("click", (e) => { e.preventDefault(); showPage("about"); });

  navLoginBtn.addEventListener("click", () => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      showPage("booking");
      renderAppointments();
    } else {
      showPage("login");
    }
  });

  // Buttons on Landing/About Pages
  document.getElementById("btnGoToLogin")?.addEventListener("click", () => showPage("login"));
  document.getElementById("btnGoToRegister")?.addEventListener("click", () => showPage("register"));
  document.querySelectorAll(".btn-cta-register, .btn-book-now").forEach(btn => {
    btn.addEventListener("click", () => showPage("register"));
  });

  document.getElementById("btnBackFromReg")?.addEventListener("click", () => showPage("welcome"));
  document.getElementById("btnBackFromLogin")?.addEventListener("click", () => showPage("welcome"));

  // Password Visibility Toggles
  document.querySelectorAll(".btn-toggle-password").forEach(btn => {
    btn.addEventListener("click", function() {
      const targetId = this.getAttribute("data-target");
      const input = document.getElementById(targetId);
      if (input.type === "password") {
        input.type = "text";
        this.textContent = "Hide";
      } else {
        input.type = "password";
        this.textContent = "Show";
      }
    });
  });

  // --- REGISTRATION LOGIC ---
  const registerForm = document.getElementById("registerForm");
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const firstName = document.getElementById("regFirstName").value.trim();
    const surname = document.getElementById("regSurname").value.trim();
    const email = document.getElementById("regEmail").value.trim().toLowerCase();
    const password = document.getElementById("regPassword").value;

    const users = getUsers();
    
    // Strict duplicate email check across all registered users
    const existingUser = users.find(u => u.email.toLowerCase() === email);

    if (existingUser) {
      showStatus("An account with this email already exists. Please log in.", "error");
      return;
    }

    const newUser = {
      firstName: firstName,
      surname: surname,
      fullName: `${firstName} ${surname}`,
      email: email, // Stored explicitly in lowercase
      password: password
    };

    users.push(newUser);
    saveUsers(users);

    showStatus("Registration successful! Please log in with your credentials.", "success");
    registerForm.reset();
    showPage("login");
  });

  // --- LOGIN LOGIC ---
  const loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;

    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email);

    if (!user) {
      showStatus("No account found with this email. Please register first.", "error");
      return;
    }

    if (user.password !== password) {
      showStatus("Incorrect password. Please try again.", "error");
      return;
    }

    setCurrentUser(user);
    showStatus(`Welcome back, ${user.firstName}!`, "success");
    loginForm.reset();
    updateDashboardGreeting();
    showPage("booking");
    renderAppointments();
  });

  // --- LOGOUT LOGIC ---
  document.getElementById("btnLogout")?.addEventListener("click", () => {
    removeCurrentUser();
    showStatus("You have been logged out.", "info");
    showPage("welcome");
  });

  function updateDashboardGreeting() {
    const currentUser = getCurrentUser();
    const greetingElement = document.getElementById("welcomeUserGreeting");
    if (currentUser && greetingElement) {
      greetingElement.textContent = `Welcome, ${currentUser.firstName} ${currentUser.surname}`;
    }
  }

  // --- SERVICE DIRECT BOOK BUTTONS ---
  document.querySelectorAll(".btn-service-book").forEach(btn => {
    btn.addEventListener("click", function() {
      const serviceName = this.getAttribute("data-service");
      const currentUser = getCurrentUser();
      
      if (!currentUser) {
        showStatus("Please log in or register to book a service.", "info");
        showPage("login");
        return;
      }

      showPage("booking");
      renderAppointments();
      const doctorSelect = document.getElementById("doctorType");
      if (doctorSelect) {
        doctorSelect.value = serviceName;
      }
    });
  });

  // --- BOOKING & APPOINTMENTS MANAGEMENT ---
  const bookingForm = document.getElementById("bookingForm");
  const editingIndexInput = document.getElementById("editingIndex"); // Holds the Appointment ID when editing
  const btnSubmitBooking = document.getElementById("btnSubmitBooking");
  const btnCancelEdit = document.getElementById("btnCancelEdit");

  // Restrict appointment date picker to today and future dates
  const bookingDateInput = document.getElementById("bookingDate");
  if (bookingDateInput) {
    const todayStr = new Date().toISOString().split("T")[0];
    bookingDateInput.setAttribute("min", todayStr);
  }

  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const currentUser = getCurrentUser();
    if (!currentUser) {
      showStatus("Session expired. Please log in again.", "error");
      showPage("login");
      return;
    }

    const service = document.getElementById("doctorType").value;
    const date = document.getElementById("bookingDate").value;
    const time = document.getElementById("bookingTime").value;
    const editingId = parseInt(editingIndexInput.value, 10);

    let appointments = getAppointments();

    if (editingId > 0) {
      // Update existing booking by unique ID
      const appIndex = appointments.findIndex(a => a.id === editingId);
      if (appIndex !== -1) {
        appointments[appIndex] = {
          id: editingId,
          userEmail: currentUser.email.toLowerCase(),
          patientName: currentUser.fullName,
          service: service,
          date: date,
          time: time
        };
        saveAppointments(appointments);
        showStatus("Appointment updated successfully!", "success");
      }
      resetBookingForm();
      renderAppointments();
    } else {
      // Create brand new booking
      const newBooking = {
        id: Date.now(),
        userEmail: currentUser.email.toLowerCase(),
        patientName: currentUser.fullName,
        service: service,
        date: date,
        time: time
      };

      appointments.push(newBooking);
      saveAppointments(appointments);

      // Populate confirmation page details
      document.getElementById("summaryEmail").textContent = currentUser.fullName;
      document.getElementById("summaryDepartment").textContent = service;
      document.getElementById("summaryDate").textContent = date;
      document.getElementById("summaryTime").textContent = time;

      resetBookingForm();
      showPage("confirmation");
    }
  });

  document.getElementById("btnGoToDashboard")?.addEventListener("click", () => {
    showPage("booking");
    renderAppointments();
  });

  btnCancelEdit?.addEventListener("click", () => {
    resetBookingForm();
  });

  function resetBookingForm() {
    bookingForm.reset();
    editingIndexInput.value = "-1";
    document.getElementById("formTitle").textContent = "Book an appointment";
    btnSubmitBooking.textContent = "Confirm booking";
    btnCancelEdit.classList.add("hidden");
  }

  function renderAppointments() {
    const currentUser = getCurrentUser();
    const container = document.getElementById("appointmentsListContainer");
    if (!container || !currentUser) return;

    // Get all non-expired appointments
    const appointments = getAppointments();
    
    // Filter specifically for the logged in user's email
    const userApps = appointments.filter(a => a.userEmail.toLowerCase() === currentUser.email.toLowerCase());

    if (userApps.length === 0) {
      container.innerHTML = `
        <div id="noAppointmentsMsg" class="empty-state-box">
          No upcoming appointments booked yet. Use the form to reserve a slot.
        </div>`;
      return;
    }

    let html = '<div class="appointments-list">';
    userApps.forEach((app) => {
      html += `
        <div class="appointment-item-card">
          <div class="app-details">
            <h4>${app.service}</h4>
            <p>📅 ${app.date} at ⏰ ${app.time}</p>
          </div>
          <div class="app-actions">
            <button type="button" class="btn-edit" onclick="editAppointment(${app.id})">Edit</button>
            <button type="button" class="btn-delete" onclick="deleteAppointment(${app.id})">Cancel</button>
          </div>
        </div>
      `;
    });
    html += '</div>';
    container.innerHTML = html;
  }

  // Edit Appointment Handler (Uses unique ID)
  window.editAppointment = function(appId) {
    const appointments = getAppointments();
    const app = appointments.find(a => a.id === appId);
    if (!app) return;

    document.getElementById("doctorType").value = app.service;
    document.getElementById("bookingDate").value = app.date;
    document.getElementById("bookingTime").value = app.time;
    editingIndexInput.value = app.id;

    document.getElementById("formTitle").textContent = "Edit appointment";
    btnSubmitBooking.textContent = "Update booking";
    btnCancelEdit.classList.remove("hidden");
  };

  // Cancel/Delete Appointment Handler (Uses unique ID)
  window.deleteAppointment = function(appId) {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      let appointments = getAppointments();
      appointments = appointments.filter(a => a.id !== appId);
      saveAppointments(appointments);
      showStatus("Appointment cancelled.", "info");
      renderAppointments();
    }
  };

  // --- NOTIFICATION TOAST ---
  function showStatus(message, type = "info") {
    const statusBox = document.getElementById("statusMessage");
    if (!statusBox) return;

    statusBox.textContent = message;
    statusBox.className = `status-message status-${type} show`;

    setTimeout(() => {
      statusBox.classList.remove("show");
    }, 4000);
  }

  // Initialize view state
  const existingUser = getCurrentUser();
  if (existingUser) {
    updateDashboardGreeting();
  }
});