import { api } from "./api.mjs";
import { lsList } from "./lsList.mjs";
lsList.clearAll();
document
  .getElementById("change-form-sign-up")
  .addEventListener(
    "click",
    () => (document.getElementById("user-forms").dataset.form = "signup")
  );
document
  .getElementById("change-form-log-in")
  .addEventListener(
    "click",
    () => (document.getElementById("user-forms").dataset.form = "login")
  );
document
  .getElementById("loginForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");

    form.classList.remove("was-validated");

    const emailInput = form.querySelector("#email");
    const passwordInput = form.querySelector("#password");
    emailInput.classList.remove("is-invalid", "is-valid");
    passwordInput.classList.remove("is-invalid", "is-valid");
    form.querySelector("#loginErrorMessage").classList.remove("d-block");
    let isValid = true;

    if (!email.endsWith("@stud.noroff.no")) {
      emailInput.classList.add("is-invalid");
      isValid = false;
    } else {
      emailInput.classList.add("is-valid");
    }

    if (password.length < 8) {
      passwordInput.classList.add("is-invalid");
      isValid = false;
    } else {
      passwordInput.classList.add("is-valid");
    }

    if (!isValid) {
      return;
    }
    const response = await api.makeCall(api.endLogin, api.post, 0, {
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (response.status == 200) {
      lsList.save("userData", response.data);

      const apiKey = await api.makeCall(api.endApiKey, api.post, 1);
      lsList.save("apiKey", apiKey.data.key);
      window.location.href = "../listings/index.html";
    } else {
      form.querySelector("#loginErrorMessage").classList.add("d-block");
    }
  });
document
  .getElementById("signupForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(event.target);
    const email = formData.get("email");
    const userName = formData.get("username");
    const password = formData.get("password");

    form.classList.remove("was-validated");
    const userNameInput = form.querySelector("#username");
    const emailInput = form.querySelector("#email");
    const passwordInput = form.querySelector("#password");
    emailInput.classList.remove("is-invalid", "is-valid");
    passwordInput.classList.remove("is-invalid", "is-valid");

    let isValid = true;

    if (!email.endsWith("@stud.noroff.no")) {
      emailInput.classList.add("is-invalid");
      isValid = false;
    } else {
      emailInput.classList.add("is-valid");
    }

    if (password.length < 8) {
      passwordInput.classList.add("is-invalid");
      isValid = false;
    } else {
      passwordInput.classList.add("is-valid");
    }
    if (userName.length < 4) {
      userNameInput.classList.add("is-invalid");
      isValid = false;
    } else {
      userNameInput.classList.add("is-valid");
    }

    if (!isValid) {
      return;
    }

    // Proceed with API call if validation passes

    const response = await api.makeCall(api.endRegister, api.post, 0, {
      name: userName,
      email: email,
      password: password,
    });
    if (response.status == 201) {
      const logInResponse = await api.makeCall(api.endLogin, api.post, 0, {
        email: email,
        password: password,
      });
      if (logInResponse.response == 200) {
        lsList.save("userData", response.data);
        const apiKey = await api.makeCall(api.endApiKey, api.post, 1);
        lsList.save("apiKey", apiKey.data.key);
        window.location.href = "../listings/index.html";
      }
    } else {
      const errorBox = form.querySelector("#signUpErrorMessage");
      errorBox.classList.add("d-block");
      errorBox.innerText =
        "Account creation failed: " + response.data[0].message;
    }
  });
