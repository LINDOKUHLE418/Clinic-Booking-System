document.addEventListener("DOMContentLoaded", () => {
  // Page Elements
  const welcomePage = document.getElementById("welcomePage");
  const servicesPage = document.getElementById("servicesPage");
  const aboutPage = document.getElementById("aboutPage");
  const registerPage = document.getElementById("registerPage");
  const loginPage = document.getElementById("loginPage");
  const bookingPage = document.getElementById("bookingPage");
  const confirmationPage = document.getElementById("confirmationPage");

  // Forms and Inputs
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");
  const bookingForm = document.getElementById("bookingForm");
  const editingIndexInput = document.getElementById("editingIndex");
  const formTitle = document.getElementById("formTitle");
  const btnSubmitBooking = document.getElementById("btnSubmitBooking");
  const btnCancelEdit = document.getElementById("btnCancelEdit");

  // Database State (In-Memory Registered Users)
  const registeredUsers = []; // Stores { name, email, password }
  let currentUser = null; // Stores logged in user object
  let pendingSelectedService = ""; // Stores service chosen before logging in

  const appointmentsListContainer = document.getElementById("appointmentsListContainer");
  const welcomeUserGreeting = document.getElementById("welcomeUserGreeting");
  const statusMessage = document.getElementById("statusMessage");

  // Appointment Storage
  let userAppointments = [];

  // Nav Links
  const navHomeLink = document.getElementById("navHomeLink");
  const navServicesLink = document.getElementById("navServicesLink");
  const navAboutLink = document.getElementById("navAboutLink");

  const btnGoToLogin = document.getElementById("btnGoToLogin");
  const navLoginBtn = document.getElementById("navLoginBtn");
  const btnGoToRegister = document.getElementById("btnGoToRegister");
  const btnBackFromReg = document.getElementById("btnBackFromReg");
  const btnBackFromLogin = document.getElementById("btnBackFromLogin");
  const btnLogout = document.getElementById("btnLogout");
  const btnGoToDashboard = document.getElementById("btnGoToDashboard");

  function goToPage(pageToShow) {
    const pages = [welcomePage, servicesPage, aboutPage, registerPage, loginPage, bookingPage, confirmationPage];
    pages.forEach(page => {
      if (page) page.classList.add("hidden");
    });
    if (pageToShow) pageToShow.classList.remove("hidden");
    if (statusMessage) statusMessage.textContent = "";

    updateNavState(pageToShow);
  }

  function updateNavState(activePage) {
    const links = [navHomeLink, navServicesLink, navAboutLink];
    links.forEach(link => { if (link) link.classList.remove("active"); });

    if (activePage === welcomePage && navHomeLink) navHomeLink.classList.add("active");
    if (activePage === servicesPage && navServicesLink) navServicesLink.classList.add("active");
    if (activePage === aboutPage && navAboutLink) navAboutLink.classList.add("active");
  }

  // Navigation handlers
  if (navHomeLink) navHomeLink.addEventListener("click", (e) => { e.preventDefault(); goToPage(welcomePage); });
  if (navServicesLink) navServicesLink.addEventListener("click", (e) => { e.preventDefault(); goToPage(servicesPage); });
  if (navAboutLink) navAboutLink.addEventListener("click", (e) => { e.preventDefault(); goToPage(aboutPage); });

  if (btnGoToLogin) btnGoToLogin.addEventListener("click", () => goToPage(loginPage));
  if (navLoginBtn) navLoginBtn.addEventListener("click", () => goToPage(loginPage));
  if (btnGoToRegister) btnGoToRegister.addEventListener("click", () => goToPage(registerPage));
  if (btnBackFromReg) btnBackFromReg.addEventListener("click", () => goToPage(welcomePage));
  if (btnBackFromLogin) btnBackFromLogin.addEventListener("click", () => goToPage(welcomePage));
  
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      currentUser = null;
      userAppointments = [];
      goToPage(welcomePage);
    });
  }

  if (btnGoToDashboard) btnGoToDashboard.addEventListener("click", () => goToPage(bookingPage));

  // PASSWORD SHOW / HIDE TOGGLE FUNCTIONALITY
  document.querySelectorAll(".btn-toggle-password").forEach(button => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      const passwordInput = document.getElementById(targetId);

      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        button.textContent = "Hide";
      } else {
        passwordInput.type = "password";
        button.textContent = "Show";
      }
    });
  });

  // Redirect to Log In page first when "Book this service" is clicked
  document.querySelectorAll(".btn-service-book").forEach(btn => {
    btn.addEventListener("click", (e) => {
      pendingSelectedService = e.target.getAttribute("data-service");
      goToPage(loginPage);
      showStatus("Please log in or register first to complete your booking.", "error");
    });
  });

  document.querySelectorAll(".btn-book-now").forEach(btn => {
    btn.addEventListener("click", () => {
      goToPage(loginPage);
    });
  });

  // Helper to show status/error messages
  function showStatus(text, type) {
    statusMessage.textContent = text;
    statusMessage.className = `status-message ${type}`;
  }

  // REGISTER HANDLER (Validates & saves user)
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nameVal = document.getElementById("regName").value.trim();
      const emailVal = document.getElementById("regEmail").value.trim().toLowerCase();
      const passwordVal = document.getElementById("regPassword").value;

      // Check if email already registered
      const existingUser = registeredUsers.find(user => user.email === emailVal);
      if (existingUser) {
        showStatus("An account with this email already exists. Please log in.", "error");
        return;
      }

      // Save new account
      registeredUsers.push({ name: nameVal, email: emailVal, password: passwordVal });
      
      showStatus("Account registered successfully! Redirecting to login...", "success");
      registerForm.reset();

      setTimeout(() => goToPage(loginPage), 1500);
    });
  }

  // LOGIN HANDLER (Strict authentication check)
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailVal = document.getElementById("loginEmail").value.trim().toLowerCase();
      const passwordVal = document.getElementById("loginPassword").value;

      // Find user in database
      const foundUser = registeredUsers.find(user => user.email === emailVal);

      if (!foundUser) {
        showStatus("No account found with this email. Please register first.", "error");
        return;
      }

      if (foundUser.password !== passwordVal) {
        showStatus("Incorrect password. Please try again.", "error");
        return;
      }

      // Authentication Successful!
      currentUser = foundUser;
      welcomeUserGreeting.textContent = `Welcome, ${currentUser.name}`;
      showStatus("Log in successful! Redirecting to dashboard...", "success");
      loginForm.reset();

      setTimeout(() => {
        goToPage(bookingPage);
        renderAppointments();
        
        // Auto-select pending service if selected prior to login
        if (pendingSelectedService) {
          document.getElementById("doctorType").value = pendingSelectedService;
          pendingSelectedService = ""; 
        }
      }, 1000);
    });
  }

  // Render appointments
  function renderAppointments() {
    if (userAppointments.length === 0) {
      appointmentsListContainer.innerHTML = `
        <div class="empty-state-box">
          No appointments booked yet. Use the form to reserve a slot.
        </div>
      `;
      return;
    }

    appointmentsListContainer.innerHTML = "";
    userAppointments.forEach((appt, index) => {
      const apptDiv = document.createElement("div");
      apptDiv.className = "appointment-item";
      apptDiv.innerHTML = `
        <div class="appt-details">
          <h4>${appt.service}</h4>
          <p>📅 ${appt.date} at ⏰ ${appt.time}</p>
        </div>
        <div class="appt-actions">
          <button type="button" class="btn-edit-appt" onclick="startEditingAppointment(${index})">Edit</button>
          <button type="button" class="btn-delete-appt" onclick="cancelAppointment(${index})">Cancel</button>
        </div>
      `;
      appointmentsListContainer.appendChild(apptDiv);
    });
  }

  // Edit functionality
  window.startEditingAppointment = function(index) {
    const appt = userAppointments[index];
    document.getElementById("doctorType").value = appt.service;
    document.getElementById("bookingDate").value = appt.date;
    document.getElementById("bookingTime").value = appt.time;

    editingIndexInput.value = index;
    formTitle.textContent = "Edit appointment";
    btnSubmitBooking.textContent = "Save changes";
    btnCancelEdit.classList.remove("hidden");
  };

  function resetBookingForm() {
    bookingForm.reset();
    editingIndexInput.value = "-1";
    formTitle.textContent = "Book an appointment";
    btnSubmitBooking.textContent = "Confirm booking";
    btnCancelEdit.classList.add("hidden");
  }

  if (btnCancelEdit) {
    btnCancelEdit.addEventListener("click", resetBookingForm);
  }

  // Cancel appointment
  window.cancelAppointment = function(index) {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      userAppointments.splice(index, 1);
      renderAppointments();
      resetBookingForm();
    }
  };

  // Booking submit handler
  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const service = document.getElementById("doctorType").value;
      const date = document.getElementById("bookingDate").value;
      const time = document.getElementById("bookingTime").value;
      const editIndex = parseInt(editingIndexInput.value);

      if (editIndex >= 0) {
        userAppointments[editIndex] = { service, date, time };
      } else {
        userAppointments.push({ service, date, time });
      }

      document.getElementById("summaryEmail").textContent = currentUser ? currentUser.name : "Patient";
      document.getElementById("summaryDepartment").textContent = service;
      document.getElementById("summaryDate").textContent = date;
      document.getElementById("summaryTime").textContent = time;

      renderAppointments();
      resetBookingForm();
      goToPage(confirmationPage);
    });
  }
});