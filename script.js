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

  // User State
  let currentUser = "Lerato"; // Default mock name
  let pendingSelectedService = ""; // Temporary storage when user clicks book before logging in
  const appointmentsListContainer = document.getElementById("appointmentsListContainer");
  const welcomeUserGreeting = document.getElementById("welcomeUserGreeting");
  const statusMessage = document.getElementById("statusMessage");

  // Appointment Storage (In-memory)
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

  // Nav link click events
  if (navHomeLink) navHomeLink.addEventListener("click", (e) => { e.preventDefault(); goToPage(welcomePage); });
  if (navServicesLink) navServicesLink.addEventListener("click", (e) => { e.preventDefault(); goToPage(servicesPage); });
  if (navAboutLink) navAboutLink.addEventListener("click", (e) => { e.preventDefault(); goToPage(aboutPage); });

  if (btnGoToLogin) btnGoToLogin.addEventListener("click", () => goToPage(loginPage));
  if (navLoginBtn) navLoginBtn.addEventListener("click", () => goToPage(loginPage));
  if (btnGoToRegister) btnGoToRegister.addEventListener("click", () => goToPage(registerPage));
  if (btnBackFromReg) btnBackFromReg.addEventListener("click", () => goToPage(welcomePage));
  if (btnBackFromLogin) btnBackFromLogin.addEventListener("click", () => goToPage(welcomePage));
  if (btnLogout) btnLogout.addEventListener("click", () => goToPage(welcomePage));
  if (btnGoToDashboard) btnGoToDashboard.addEventListener("click", () => goToPage(bookingPage));

  // Redirect to Log In page first when "Book this service" is clicked
  document.querySelectorAll(".btn-service-book").forEach(btn => {
    btn.addEventListener("click", (e) => {
      pendingSelectedService = e.target.getAttribute("data-service");
      goToPage(loginPage);
      statusMessage.textContent = "Please log in to complete your booking.";
      statusMessage.className = "status-message";
    });
  });

  document.querySelectorAll(".btn-book-now").forEach(btn => {
    btn.addEventListener("click", () => {
      goToPage(loginPage);
    });
  });

  // Render list of booked appointments
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

  // Cancel functionality
  window.cancelAppointment = function(index) {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      userAppointments.splice(index, 1);
      renderAppointments();
      resetBookingForm();
    }
  };

  // Login handler
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailVal = document.getElementById("loginEmail").value;
      if (emailVal) {
        currentUser = emailVal.split("@")[0];
      }
      welcomeUserGreeting.textContent = `Welcome, ${currentUser}`;
      statusMessage.textContent = "Log in successful! Redirecting to booking page...";
      statusMessage.className = "status-message success";
      loginForm.reset();

      setTimeout(() => {
        goToPage(bookingPage);
        renderAppointments();
        
        // If they clicked a service on the services page prior to logging in, auto-select it
        if (pendingSelectedService) {
          document.getElementById("doctorType").value = pendingSelectedService;
          pendingSelectedService = ""; // clear temporary selection
        }
      }, 1000);
    });
  }

  // Register handler
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nameVal = document.getElementById("regName").value;
      if (nameVal) currentUser = nameVal;
      statusMessage.textContent = "Account registered successfully! Please log in.";
      statusMessage.className = "status-message success";
      registerForm.reset();
      setTimeout(() => goToPage(loginPage), 1500);
    });
  }

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

      document.getElementById("summaryEmail").textContent = currentUser;
      document.getElementById("summaryDepartment").textContent = service;
      document.getElementById("summaryDate").textContent = date;
      document.getElementById("summaryTime").textContent = time;

      renderAppointments();
      resetBookingForm();
      goToPage(confirmationPage);
    });
  }
});