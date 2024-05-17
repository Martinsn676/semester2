import { api } from "../js/api.mjs";
import { lsList } from "../js/lsList.mjs";

export const editHandler = {
  init(object, string) {
    this.addAction(string);
    return this.template(object[string], string);
  },
  template(original = "", string) {
    return `<div id="edit-${string}" class="text-center editale-box">${original}<i class="bi bi-pencil-fill"></i></div>`;
  },
  addAction(string) {
    setTimeout(() => {
      const thisEdit = document.getElementById("edit-" + string);
      thisEdit.addEventListener("click", (event) => {
        console.log(event.target);
        if (thisEdit.dataset.mode != "editing") {
          thisEdit.dataset.mode = "editing";

          const orgValue = thisEdit.innerText;
          thisEdit.innerHTML = `
            <div class="d-flex flex-row">                      
                <input
                    type="text"
                    id="username"
                    name="username"
                    class="form-control"
                    placeholder="Enter new ${string}"
                />
                <button
                    type="button"
                    class="btn btn-secondary"
                    data-dismiss="modal"
                >
                    Save
                </button>
            `;
          const input = thisEdit.querySelector("input");
          input.focus();
          input.value = orgValue;
          const button = thisEdit.querySelector("button");
          button.addEventListener("click", () =>
            this.saveChange(input.value, string)
          );
        }
      });
    }, 300);
  },
  async saveChange(newValue, string) {
    const profile = await lsList.get("profileData");
    const body = {};
    body[string] = newValue;
    const response = await api.makeCall(
      `${api.endProfiles}/${profile.name}`,
      api.put,
      2,
      body
    );
    if (response.status == 200) {
      const thisEdit = document.getElementById("edit-" + string);
      thisEdit.innerHTML = this.template(newValue, string);
      thisEdit.dataset.mode = "";
      this.addAction(string);
    }
    console.log("response", response);
  },
};
