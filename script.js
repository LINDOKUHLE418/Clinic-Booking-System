document.addEventListener("DOMContentLoaded", () => {
  // Page Elements
  const welcomePage = document.getElementById("welcomePage");
  const registerPage = document.getElementById("registerPage");
  const loginPage = document.getElementById("loginPage");
  const bookingPage = document.getElementById("bookingPage");
  const confirmationPage = document.getElementById("confirmationPage");

  // Forms
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");
  const bookingForm = document.getElementById("bookingForm");
  const statusMessage = document.getElementById("statusMessage");

  // Buttons
  const btnGoToLogin = document.getElementById("btnGoToLogin");
  const btnGoToRegister = document.getElementById("btnGoToRegister");
  const btnBackFromReg = document.getElementById("btnBackFromReg");
  const btnBackFromLogin = document.getElementById("btnBackFromLogin");
  const btnNewBooking = document.getElementById("btnNewBooking");

  // Summary Card Elements
  const summaryEmail = document.getElementById("summaryEmail");
  const summaryDepartment = document.getElementById("summaryDepartment");
  const summaryDate = document.getElementById("summaryDate");
  const summaryTime = document.getElementById("summaryTime");

  // Page Switcher Helper
  function goToPage(pageToShow) {
    const pages = [welcomePage, registerPage, loginPage, bookingPage, confirmationPage];
    pages.forEach(page => {
      if (page) page.classList.add("hidden");
    });
    if (pageToShow) pageToShow.classList.remove("hidden");
    if (statusMessage) statusMessage.textContent = "";
  }

  // 1. Welcome Page Button Listeners
  if (btnGoToLogin) {
    btnGoToLogin.addEventListener("click", () => goToPage(loginPage));
  }

  if (btnGoToRegister) {
    btnGoToRegister.addEventListener("click", () => goToPage(registerPage));
  }

  // 2. Back Button Listeners
  if (btnBackFromReg) {
    btnBackFromReg.addEventListener("click", () => goToPage(welcomePage));
  }

  if (btnBackFromLogin) {
    btnBackFromLogin.addEventListener("click", () => goToPage(welcomePage));
  }

  // 3. Register Submission -> Redirect to Welcome Page
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      statusMessage.textContent = "Account registered successfully! Redirecting to Welcome page...";
      statusMessage.className = "status-message success";
      registerForm.reset();

      setTimeout(() => {
        goToPage(welcomePage);
      }, 1500);
    });
  }

  // 4. Login Submission -> Redirect to Booking Page
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      statusMessage.textContent = "Log in successful! Loading booking page...";
      statusMessage.className = "status-message success";
      loginForm.reset();

      setTimeout(() => {
        goToPage(bookingPage);
      }, 1200);
    });
  }

  // 5. Booking Submission -> Redirect to Confirmation Page
  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const department = document.getElementById("doctorType").value;
      const date = document.getElementById("bookingDate").value;
      const time = document.getElementById("bookingTime").value;

      summaryEmail.textContent = "patient@ubuntuclinic.co.za";
      summaryDepartment.textContent = department;
      summaryDate.textContent = date;
      summaryTime.textContent = time;

      bookingForm.reset();
      goToPage(confirmationPage);
    });
  }

  // 6. Return to Start from Confirmation Page
  if (btnNewBooking) {
    btnNewBooking.addEventListener("click", () => goToPage(welcomePage));
  }
});