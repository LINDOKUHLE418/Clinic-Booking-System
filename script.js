document.addEventListener("DOMContentLoaded", () => {
  // Page Views
  const welcomePage = document.getElementById("welcomePage");
  const servicesPage = document.getElementById("servicesPage");
  const aboutPage = document.getElementById("aboutPage");
  const contactPage = document.getElementById("contactPage");
  const registerPage = document.getElementById("registerPage");
  const loginPage = document.getElementById("loginPage");
  const bookingPage = document.getElementById("bookingPage");
  const confirmationPage = document.getElementById("confirmationPage");

  // Nav Links
  const navHome = document.getElementById("navHome");
  const navServices = document.getElementById("navServices");
  const navAbout = document.getElementById("navAbout");
  const navContact = document.getElementById("navContact");
  const navLogo = document.getElementById("navLogo");

  // Forms
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");
  const bookingForm = document.getElementById("bookingForm");
  const statusMessage = document.getElementById("statusMessage");

  // Buttons
  const btnGoToLogin = document.getElementById("btnGoToLogin");
  const navLoginBtn = document.getElementById("navLoginBtn");
  const btnGoToRegister = document.getElementById("btnGoToRegister");
  const btnBackFromReg = document.getElementById("btnBackFromReg");
  const btnBackFromLogin = document.getElementById("btnBackFromLogin");
  const btnNewBooking = document.getElementById("btnNewBooking");

  // Summary Card Elements
  const summaryEmail = document.getElementById("summaryEmail");
  const summaryDepartment = document.getElementById("summaryDepartment");
  const summaryDate = document.getElementById("summaryDate");
  const summaryTime = document.getElementById("summaryTime");

  const allNavLinks = [navHome, navServices, navAbout, navContact];

  // Helper function to switch views & active tab styling
  function goToPage(pageToShow, activeNavLink = null) {
    const pages = [welcomePage, servicesPage, aboutPage, contactPage, registerPage, loginPage, bookingPage, confirmationPage];
    pages.forEach(page => {
      if (page) page.classList.add("hidden");
    });
    if (pageToShow) pageToShow.classList.remove("hidden");
    if (statusMessage) statusMessage.textContent = "";

    // Manage active state on navbar links
    allNavLinks.forEach(link => {
      if (link) link.classList.remove("active");
    });
    if (activeNavLink) activeNavLink.classList.add("active");
  }

  // Navigation Bar Click Listeners
  if (navHome) navHome.addEventListener("click", (e) => { e.preventDefault(); goToPage(welcomePage, navHome); });
  if (navLogo) navLogo.addEventListener("click", () => goToPage(welcomePage, navHome));
  if (navServices) navServices.addEventListener("click", (e) => { e.preventDefault(); goToPage(servicesPage, navServices); });
  if (navAbout) navAbout.addEventListener("click", (e) => { e.preventDefault(); goToPage(aboutPage, navAbout); });
  if (navContact) navContact.addEventListener("click", (e) => { e.preventDefault(); goToPage(contactPage, navContact); });

  // Action Buttons
  if (btnGoToLogin) btnGoToLogin.addEventListener("click", () => goToPage(loginPage));
  if (navLoginBtn) navLoginBtn.addEventListener("click", () => goToPage(loginPage));
  if (btnGoToRegister) btnGoToRegister.addEventListener("click", () => goToPage(registerPage));
  if (btnBackFromReg) btnBackFromReg.addEventListener("click", () => goToPage(welcomePage, navHome));
  if (btnBackFromLogin) btnBackFromLogin.addEventListener("click", () => goToPage(welcomePage, navHome));

  // Form Submissions
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      statusMessage.textContent = "Account registered successfully! Redirecting to Welcome page...";
      statusMessage.className = "status-message success";
      registerForm.reset();
      setTimeout(() => goToPage(welcomePage, navHome), 1500);
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      statusMessage.textContent = "Log in successful! Loading booking page...";
      statusMessage.className = "status-message success";
      loginForm.reset();
      setTimeout(() => goToPage(bookingPage), 1200);
    });
  }

  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      summaryEmail.textContent = "patient@ubuntuclinic.co.za";
      summaryDepartment.textContent = document.getElementById("doctorType").value;
      summaryDate.textContent = document.getElementById("bookingDate").value;
      summaryTime.textContent = document.getElementById("bookingTime").value;

      bookingForm.reset();
      goToPage(confirmationPage);
    });
  }

  if (btnNewBooking) btnNewBooking.addEventListener("click", () => goToPage(welcomePage, navHome));
});