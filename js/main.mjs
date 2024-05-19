import { listingHandler } from "../listings/listings.mjs";
import { api } from "./api.mjs";
import { lsList } from "./lsList.mjs";
import { template } from "./mainTemplates.mjs";
import { modal } from "./modal.mjs";
const isSignedIn = (await lsList.get("userData")) || false;

if (isSignedIn) {
  document.querySelector("header").innerHTML = template.header();
  document
    .querySelector(".add-listing-button")
    .addEventListener("click", () => modal.displayCreateListing());

  const profileInfo = await lsList.get("profileInfo");
  if (!profileInfo) {
    const userData = await lsList.get("userData");
    const profileResponse = await api.makeCall(
      api.endProfiles + "/" + userData.name,
      api.get,
      2,
      false,
      ["_listings=true", "_wins=true"]
    );
    lsList.save("profileData", profileResponse.data);
    document.getElementById("credit-count").innerHTML = `
        <div class="d-flex align-items-center">
          <img src="${profileResponse.data.avatar.url}" alt="Account Icon" class="rounded-circle mr-3 account-icon">
          <div class="mr-3">
            <h5 class="mb-0">Credits</h5>

          </div>
        </div>
        <span id="user-credits" class=" badge badge-success badge-pill">${profileResponse.data.credits}</span>`;
  }
} else {
  document.querySelector("header").innerHTML = template.headerGuest();
}
