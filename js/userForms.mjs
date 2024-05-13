import { api } from "./api.mjs";
import { lsList } from "./lsList.mjs";
lsList.delete("accessToken");
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
    const formData = createForm(event.target);
    const response = await api.makeCall(api.endLogin, api.post, 0, {
      email: formData.get("email"),
      password: formData.get("password"),
    });
    if (response) {
      lsList.save("accessToken", response.data.accessToken);
      const apiKey = await api.makeCall(api.endApiKey, api.post, 1);
      lsList.save("apiKey", apiKey.data.key);
      window.location.href = "../listings/index.html";
    }
  });
document.getElementById("signupForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = createForm(event.target);

  api.makeCall(api.endRegister, api.post, {
    name: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
});

function createForm(target) {
  const formData = new FormData(target);
  const orderData = {};
  formData.forEach((value, key) => {
    orderData[key] = value;
  });
  console.log("formData", formData);
  return formData;
}
