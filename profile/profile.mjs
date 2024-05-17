import { api } from "../js/api.mjs";
import { lsList } from "../js/lsList.mjs";
import { editHandler } from "./editProfile.mjs";

const profileContainer = document.getElementById("profile-card");
const profile = await lsList.get("profileData");
profileContainer.innerHTML = `
 <div class="card mt-5">
    <div class="card-header">
    <h3 class="text-center">${profile.name}</h3>
    </div>
    <div class="card-body">
    <div class="text-center mb-4">
        <img id="profile-image"
        src="${profile.avatar.url}"
        class="rounded-circle"
        alt="Profile Picture"
        />
       
    </div>
 <form id="newAvatarForm" class="p-3 d-flex flex-row">                      
            <input
                type="text"
                id="newAvatar"
                name="newAvatar"
                class="form-control"
                placeholder="Enter new Avatar url"
            />
            <button
                type="submit"
                class="btn btn-secondary"
                data-dismiss="modal"
            >
                Save
            </button>
        </form>
    <p class="card-text ">${editHandler.init(profile, "bio")}</p>
    <ul class="list-group list-group-flush">
        <li class="list-group-item">
        <strong>Email:</strong> ${profile.email}
        </li>
        <li class="list-group-item">
        <strong>Listings:</strong> ${profile.listings.length}
        </li>
        <li class="list-group-item">
        <strong>Wins:</strong> ${profile.wins.length}
        </li>
    </ul>
    </div>

</div>
`;

document
  .getElementById("newAvatarForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = document.getElementById("newAvatar");
    const response = await api.makeCall(
      `${api.endProfiles}/${profile.name}`,
      api.put,
      2,
      { avatar: { url: input.value } }
    );
    if (response.status == 200) {
      document.getElementById("profile-image").src = input.value;
    }
  });
