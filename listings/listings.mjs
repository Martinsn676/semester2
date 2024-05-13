import { api } from "../js/api.mjs";
import { template } from "../js/mainTemplates.mjs";
import { modal } from "../js/modal.mjs";

const listingHandler = {
  async init() {
    console.log("init");
    this.mainContainer = document.getElementById("product-listings");
    this.mainContainer.innerHTML = this.template(await this.getListings());
    this.addFunctions();
  },
  async getListings() {
    const response = await api.makeCall(
      api.endListings,
      api.get,
      0,
      false,
      api.listingExtras
    );
    console.log("response", response);
    this.listings = response.data;
    return this.listings;
  },
  template(items) {
    let html = "";
    console.log("items", items);
    items.forEach((item) => {
      if (this.blacklistCheck(item)) {
        html += `
        <div class="product-list-item col-md-4" data-id="${item.id}">
          <div class="card mb-4 shadow-sm">
            <div class="iamge-container">
              <img src="${
                item.media[0].url
              }" class="card-img-top" alt="Product 1">
            </div>
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
              <p class="card-text">${item.description}</p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                  <button type="button" class="view-button btn btn-sm btn-outline-secondary">View bids</button>
                  <button type="button" class="bid-button btn btn-sm btn-outline-secondary">Place bid</button>
                </div>
                <small class="text-muted">${this.getBid(item)}</small>
              </div>
            </div>
          </div>
        </div>`;
      }
    });
    return html;
  },
  addFunctions() {
    this.listings.forEach((listing) => {
      if (this.blacklistCheck(listing)) {
        const item = this.mainContainer.querySelector(
          `.product-list-item[data-id="${listing.id}"]`
        );
        item
          .querySelector(".view-button")
          .addEventListener("click", () => modal.displayListing(listing));
        item
          .querySelector(".bid-button")
          .addEventListener("click", () => modal.displayBids(listing));
      }
    });
  },
  blacklistCheck(item) {
    if (
      !item.media[0] ||
      item.description.length < 10 ||
      item.title.startsWith("Titt") ||
      item.title.includes("Lorem")
    ) {
      return false;
    }
    return true;
  },
  getBid(item) {
    const count = item.bids.length;
    let reply;
    if (count === 0) {
      reply = "No bids yet";
    } else {
      reply = "Current bid: " + item.bids[count - 1].amount;
    }
    return reply;
  },
};
listingHandler.init();
