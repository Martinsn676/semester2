import { api } from "./api.mjs";
import { template } from "./mainTemplates.mjs";

export const modal = {
  init() {
    const modal = document.createElement("div");
    modal.id = "modal";
    modal.innerHTML = this.template();
    document.querySelector("main").append(modal);
    this.mainContainer = document.getElementById("modal");
    this.container = this.mainContainer.querySelector(".modal-content");
    this.mainContainer
      .querySelector("#modal-bg")
      .addEventListener("click", () => this.hide());
    console.log("this.mainContainer", this.mainContainer);
  },
  hide() {
    this.mainContainer.classList.add("d-none");
  },
  displayListing(listing) {
    if (!this.mainContainer) {
      this.init();
    }
    this.mainContainer;
  },
  displayBids(listing) {
    if (!this.mainContainer) {
      this.init();
    }
    this.mainContainer.classList.remove("d-none");
    this.container.innerHTML = this.listingTemplate(listing);
    this.container
      .querySelector(".bid-button")
      .addEventListener("click", async (event) => {
        const bidValue = this.container.querySelector("#newBid").value;
        const id =
          this.container.querySelector(".product-list-item").dataset.id;
        const response = await api.makeCall(
          api.endListings,
          api.post,
          2,
          { amount: Number(bidValue) },

          `/${id}/bids`
        );
        console.log("response", response, response.status);
        if (response.status == 201) {
          console.log("id", id);
          const refresh = await api.makeCall(
            api.endListings + `/${id}`,
            api.get,
            0,
            false,

            api.listingExtras
          );
          console.log("refresh", refresh);
          this.displayBids(refresh.data);
        }
      });
  },
  listingTemplate(listing) {
    return `
    <div class="modal-listing d-flex flex-row">
      <div class="col-6 left-side product-list-item" data-id="${listing.id}">
        <img src="${listing.media[0].url}" class="" alt="Product 1">
        <div class="card-body">
            <h5 class="card-title">${listing.title}</h5>
            <p class="card-text">${listing.description}</p>
        </div>
      </div>
      <div class="right-side col-6 d-flex flex-column">
        <div class="allBids">
          ${this.templateBids(listing)}
        </div>
        <div class="flex-row d-flex p-3">
          <input id="newBid" name="newBid" type="number" min="0" step="1">
          <button type="button" class="bid-button btn btn-sm btn-outline-secondary">Place bid</button>
      </div>
    </div>`;
  },
  template() {
    return `
<div id="modal-bg"></div>
    <div class="modal-container">
        <div class="modal-content">
        </div>
    </div>
</div>
    `;
  },
  templateBids(listing) {
    const bids = listing.bids;
    let html = "";
    bids.forEach((bid) => {
      const avatarSrc = bid.bidder.avatar
        ? bid.bidder.avatar.url
        : "../images/replaceAvatar.png";
      console.log("bid", bid);
      html += `
        <div class="bidder-details m-3 d-flex flex-row align-items-center justify-content-center">
          <div class="col-3">
           <img src="${avatarSrc}" class="img-fluid" alt="Profile Image">
          </div>
          <div class="col">
            <div class="bidder">
              ${bid.bidder.name} bid ${bid.amount}
            </div>
        </div>
      </div>`;
    });
    console.log("html", html);
    return html;
  },
};
