import { api } from "../js/api.mjs";
import { getTime } from "../js/global.mjs";
import { lsList } from "../js/lsList.mjs";
import { template } from "../js/mainTemplates.mjs";
import { modal } from "../js/modal.mjs";

export const listingHandler = {
  async init(place) {
    this.mainContainer = document.getElementById(place);
    this.onlyActive = document.getElementById("onlyActive");
    this.allListings = document.getElementById("allListings");
    this.searchInput = document.getElementById("search-filter");
    await this.addListings();
    this.addFunctions();
  },
  async addListings(endPoint = api.endListings, filter = []) {
    if (this.onlyActive.checked) {
      filter.push("_active=true");
    }
    const response = await api.makeCall(endPoint, api.get, 0, false, [
      "_seller=true",
      "_bids=true",
      ...filter,
    ]);
    if (response.status == 200) {
      this.listings = response.data;
      this.mainContainer.innerHTML = await this.template(response.data);
      this.listings.forEach((listing) => {
        if (this.blacklistCheck(listing)) {
          const item = this.mainContainer.querySelector(
            `.product-list-item[data-id="${listing.id}"]`
          );
          item
            .querySelector(".view-button")
            .addEventListener("click", () => modal.displayListing(listing));

          const bidButton = item.querySelector(".bid-button");
          if (bidButton) {
            bidButton.addEventListener("click", () =>
              modal.displayListing(listing)
            );
          }
          const viewOwnerButton = item.querySelector(".view-owner-button");
          if (viewOwnerButton) {
            viewOwnerButton.addEventListener("click", () =>
              modal.displayListing(listing, true)
            );
          }
          const diff = getTime.difference(listing.endsAt);
          const countDown = item.querySelector(".count-down");
          if (diff.totalMin < 0) {
            countDown.innerHTML = "Auction ended";
          } else if (diff.totalMin < 180) {
            let minutes = diff.totalMin;
            countDown.innerHTML = minutes + " min left";
            const countdownInterval = setInterval(() => {
              minutes--;
              countDown.innerHTML = minutes + " min left";

              if (minutes < 0) {
                clearInterval(countdownInterval);
                countDown.innerHTML = "Countdown expired";
              }
            }, 60000);
          } else {
            const time = getTime.format(listing.endsAt);
            countDown.innerHTML = `Ends ${time.dd}.${time.mo} at ${time.hh}:${time.ss}`;
          }
        }
      });
    }
  },
  async template(items) {
    let html = "";
    const userData = await lsList.get("userData");
    const userEmail = userData ? userData.email : "none";
    items.forEach((item) => {
      if (this.blacklistCheck(item)) {
        const isOwner = item.seller.email == userEmail;
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
                ${
                  isOwner
                    ? ` <button type="button" class="view-owner-button btn btn-sm btn-outline-secondary">View listing</button>
                        <button type="button" class="view-button btn btn-sm btn-outline-secondary">Edit listing</button>`
                    : ` 
                      <button type="button" class="view-button btn btn-sm btn-outline-secondary">View bids</button>
                      <button type="button" class="bid-button btn btn-sm btn-outline-secondary">Place bid</button>`
                }
                </div>
                <div class="flex-column d-flex">
                  <small class="count-down"></small>
                  <small class="text-muted">${this.getBid(item)}</small>
                </div>
              </div>
            </div>
          </div>
        </div>`;
      }
    });
    return html;
  },
  addFunctions() {
    const listingFilter = document.getElementById("listing-filter");

    listingFilter.addEventListener("submit", (event) => {
      event.preventDefault();
      if (this.searchInput.value != "" && this.searchInput.value.length > 0) {
        this.addListings(api.endListingSearch + this.searchInput.value);
      }
    });
    // Add event listeners for changes to the checkboxes
    this.onlyActive.addEventListener("change", (event) => {
      event.preventDefault();

      this.addListings();
    });
    this.allListings.addEventListener("change", (event) => {
      event.preventDefault();

      this.addListings();
    });
  },

  blacklistCheck(item) {
    if (!item.media[0]) {
      return false;
    }
    return true;
  },
  getBid(item) {
    let reply = "";
    if (item.bids) {
      const count = item.bids.length;

      if (count === 0) {
        reply = "No bids yet";
      } else {
        reply = "Current bid: " + item.bids[count - 1].amount;
      }
    }
    return reply;
  },
};
