document.addEventListener("DOMContentLoaded", () => {
  const welcomePage = document.getElementById("welcomePage");
  const registerPage = document.getElementById("registerPage");
  const loginPage = document.getElementById("loginPage");
  const bookingPage = document.getElementById("bookingPage");
  const confirmationPage = document.getElementById("confirmationPage");

  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");
  const bookingForm = document.getElementById("bookingForm");
  const statusMessage = document.getElementById("statusMessage");

  const btnGoToLogin = document.getElementById("btnGoToLogin");
  const navLoginBtn = document.getElementById("navLoginBtn");
  const btnGoToRegister = document.getElementById("btnGoToRegister");
  const btnBackFromReg = document.getElementById("btnBackFromReg");
  const btnBackFromLogin = document.getElementById("btnBackFromLogin");
  const btnNewBooking = document.getElementById("btnNewBooking");

  const summaryEmail = document.getElementById("summaryEmail");
  const summaryDepartment = document.getElementById("summaryDepartment");
  const summaryDate = document.getElementById("summaryDate");
  const summaryTime = document.getElementById("summaryTime");

  function goToPage(pageToShow) {
    const pages = [welcomePage, registerPage, loginPage, bookingPage, confirmationPage];
    pages.forEach(page => {
      if (page) page.classList.add("hidden");
    });
    if (pageToShow) pageToShow.classList.remove("hidden");
    if (statusMessage) statusMessage.textContent = "";
  }

  if (btnGoToLogin) btnGoToLogin.addEventListener("click", () => goToPage(loginPage));
  if (navLoginBtn) navLoginBtn.addEventListener("click", () => goToPage(loginPage));
  if (btnGoToRegister) btnGoToRegister.addEventListener("click", () => goToPage(registerPage));
  if (btnBackFromReg) btnBackFromReg.addEventListener("click", () => goToPage(welcomePage));
  if (btnBackFromLogin) btnBackFromLogin.addEventListener("click", () => goToPage(welcomePage));

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      statusMessage.textContent = "Account registered successfully! Redirecting to Welcome page...";
      statusMessage.className = "status-message success";
      registerForm.reset();
      setTimeout(() => goToPage(welcomePage), 1500);
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

  if (btnNewBooking) btnNewBooking.addEventListener("click", () => goToPage(welcomePage));
});