import { listingHandler } from "../listings/listings.mjs";
import { api } from "./api.mjs";
import { lsList } from "./lsList.mjs";
import { template } from "./mainTemplates.mjs";

export const modal = {
  init() {
    this.mainContainer = document.getElementById("modal");

    this.container = this.mainContainer.querySelector(".modal-body");
  },
  displayCreateListing() {
    if (!this.container) {
      this.init();
    }
    $("#modal").modal("show");

    this.container.innerHTML = this.crateTemplate();
    this.container
      .querySelector("#addListingForm")
      .addEventListener("submit", (event) => this.submitListing(event));
  },
  async submitListing(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const dateString = formData.get("endDate"); // Get the date string from the form
    const timeString = formData.get("endTime"); // Get the time string from the form

    // Concatenate the date and time strings with 'T' in between
    const dateTimeString = `${dateString}T${timeString}`;

    // Create a new Date object using the combined date and time string
    const date = new Date(dateTimeString);

    // Format the date string
    const formattedDate = date.toISOString();
    const images = document
      .getElementById("item-images")
      .querySelectorAll("input");
    const media = [];
    images.forEach((image) => {
      if (image.value != "") {
        media.push({
          url: image.value,
          alt: "Image of listing item",
        });
      }
    });

    const body = {
      title: formData.get("itemName"),
      description: formData.get("itemDescription"),
      tags: [formData.get("itemTags")],
      media: media,
      endsAt: formattedDate,
    };

    const response = await api.makeCall(api.endListings, api.post, 2, body);

    if (response.status == 201) {
      document.getElementById("create-post-feedback").innerText =
        "Succesfully created";
      const refresh = await api.makeCall(
        `${api.endListings}/${response.data.id}`,
        api.get,
        0,
        false,
        ["_seller=true", "_bids=true"]
      );
      this.displayListing(refresh.data);
    } else {
      document.getElementById("create-post-feedback").innerText =
        response.data[0].message;
    }
  },
  crateTemplate() {
    return `
  <div class="modal-header">
    <h5 class="modal-title" id="addListingModalLabel">List a New Item for Bidding</h5>
  </div>
  <div class="modal-body">
    <form id="addListingForm">
      <div class="mb-3">
        <label for="itemName" class="form-label">Item Name</label>
        <input type="text" class="form-control" id="itemName" name="itemName" required>
      </div>
      <div class="mb-3">
        <label for="itemDescription" class="form-label">Item Description</label>
        <textarea class="form-control" id="itemDescription" name="itemDescription" rows="3" required></textarea>
      </div>
      <div class="mb-3">
        <label for="endDateTime" class="form-label">End Date and Time</label>
        <div class="row">
          <div class="col">
            <input type="date" class="form-control" id="endDate" name="endDate" required>
          </div>
          <div class="col">
            <input type="time" class="form-control" id="endTime" name="endTime" required>
          </div>
        </div>
      </div>
      <div class="mb-3">
        <label for="itemTags" class="form-label">Tags</label>
        <input type="text" class="form-control" id="itemTags" name="itemTags" placeholder="Enter tags separated by commas">
        <small class="form-text text-muted">Enter tags separated by commas (e.g., tag1, tag2, tag3).</small>
      </div>
      <div id="item-images" class="mb-3">
        <label for="itemImage" class="form-label">Add up to 3 image urls</label>
        <input type="url" class="form-control"  name="itemImage" required>

        <input type="url" class="form-control" name="itemImage" >

        <input type="url" class="form-control" name="itemImage" >
      </div>
      <div 
      <div id="create-post-feedback" class="p-2">

      </div>
      <button type="submit" class="btn btn-primary">Submit Listing</button>
    </form>
  </div>`;
  },

  async displayListing(listing, overrideIsOwner) {
    if (!this.container) {
      this.init();
    }
    $("#modal").modal("show");

    this.container.innerHTML = await this.listingTemplate(
      listing,
      overrideIsOwner
    );
    const isSignedIn = (await lsList.get("userData")) || false;
    if (!isSignedIn) {
      this.container.querySelector("#newBid").disabled = true;
      this.container.querySelector(".bid-button").disabled = true;
      this.container.querySelector(".bid-button").classList =
        "btn btn-primary disabled";
      this.container.querySelector(".bid-message").innerText = "Sign in to bid";
    }
    const bidButton = this.container.querySelector(".bid-button");
    if (bidButton) {
      bidButton.addEventListener("click", async (event) => {
        const bidValue = this.container.querySelector("#newBid").value;
        const id =
          this.container.querySelector(".product-list-item").dataset.id;
        const response = await api.makeCall(
          `${api.endListings}/${id}/bids`,
          api.post,
          2,
          { amount: Number(bidValue) }
        );
        if (response.status == 201) {
          const refresh = await api.makeCall(
            `${api.endListings}/${id}`,
            api.get,
            0,
            false,
            ["_seller=true", "_bids=true"]
          );
          const credits = document.getElementById("user-credits");
          credits.innerText = Number(credits.innerText) - bidValue;
          this.displayListing(refresh.data);
        } else {
          this.container.querySelector(".bid-message").innerText =
            response.data[0].message;
        }
      });
    }
    const scrollableBox = document.querySelector(".allBids");
    scrollableBox.scrollTop =
      scrollableBox.scrollHeight - scrollableBox.clientHeight;
  },
  async listingTemplate(listing, overrideIsOwner) {
    const minListing =
      listing.bids.length > 0
        ? listing.bids[listing.bids.length - 1].amount + 1
        : 1;

    const userProfile = await lsList.get("userData");

    let isOwner = false;
    if (!overrideIsOwner && listing.seller.email == userProfile.email) {
      isOwner = true;
      document.querySelector("#modal .modal-footer").innerHTML = `
        <button
          type="button"
          class="btn btn-secondary"
          id='save-changes'
        >
          Save
        </button>
        <button
          type="button"
          class="btn btn-secondary"
          id='delete-listing'
        >
          Delete
        </button>
        <button
          type="button"
          class="btn btn-secondary"
          data-dismiss="modal"
        >
          Close
        </button>
        `;

      document
        .getElementById("delete-listing")
        .addEventListener("click", async () => {
          const id =
            this.container.querySelector(".product-list-item").dataset.id;
          api.makeCall(`${api.endListings}/${id}`, api.del, 2);
        });
      document
        .getElementById("save-changes")
        .addEventListener("click", async () => {
          const id =
            this.container.querySelector(".product-list-item").dataset.id;
          const images = this.container
            .querySelector("#edit-images")
            .querySelectorAll("input");

          const media = [];
          images.forEach((image) => {
            if (image.value != "") {
              media.push({
                url: image.value,
                alt: "Image of listing item",
              });
            }
          });

          const body = {
            title: this.container.querySelector("#editTitle").value,
            media: media,
            description: this.container.querySelector("#editDescription").value,
          };
          const response = await api.makeCall(
            `${api.endListings}/${id}`,
            api.put,
            2,
            body
          );
          if (response.status == 200) {
          }
        });
    }

    return `
<div class="modal-listing d-flex flex-column flex-lg-row">
  <div class="col-12 col-lg-6 left-side product-list-item d-flex flex-column  align-items-center" data-id="${
    listing.id
  }">
    ${
      isOwner
        ? `
      <input type="text" class="form-control mb-2" value="${
        listing.title
      }" id="editTitle">
      <div id="edit-images">
${listing.media
  .slice(0, 3) // Limit to 3 items
  .map(
    (media, index) => `<div class="d-flex flex-row align-items-center">
      <img src="${
        media.url
      }" class="edit-image-display img-fluid mt-2" alt="Product Image ${
      index + 2
    }">
      <input type="text" class="ml-3 form-control mt-2" value="${
        media.url
      }" id="editImage${index + 2}"></div>
    `
  )
  .join("")}
${
  listing.media.length < 3
    ? '<input type="text" class="form-control mt-2" value="" id="editImage3">'
    : ""
}

</div>
    `
        : `
      <h5 class="card-title">${listing.title}</h5>
      <div id="gallery" class="carousel slide" data-ride="carousel">
        <div class="carousel-inner">
          ${listing.media
            .map(
              (media, index) => `
              <div class="carousel-item${index === 0 ? " active" : ""}">
                <img src="${
                  media.url
                }" class="d-block w-100" alt="Product Image ${index + 1}">
              </div>
            `
            )
            .join("")}
        </div>
        <a class="carousel-control-prev" href="#gallery" role="button" data-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#gallery" role="button" data-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="sr-only">Next</span>
        </a>
      </div>
    `
    }
    
      ${
        isOwner
          ? `<textarea class="form-control mt-5" id="editDescription">${listing.description}</textarea>`
          : `<div class="card-body text-center"><p class="card-text">${listing.description}</p></div>`
      }
    
  </div>
  <div class="right-side col-12 col-lg-6 d-flex flex-column">
    <div class="allBids">
      ${this.templateBids(listing)}
    </div>
    ${
      isOwner
        ? ""
        : `
      <div class="d-flex align-items-center mt-3">
        <input id="newBid" name="newBid" type="number" min="${minListing}" step="1" value="${minListing}" class="form-control mr-2" placeholder="Enter your bid">
        <button type="button" class="bid-button btn btn-outline-primary">Place bid</button>
      </div>
      <small class="bid-message text-danger mt-2"></small>`
    }
  </div>
</div>
`;
  },

  templateBids(listing) {
    const bids = listing.bids;
    let html = "";
    if (bids.length == 0) {
      html = "No bids yet, be the first!";
    } else {
      bids.forEach((bid) => {
        html += `
      <div class="bidder-details m-3 d-flex align-items-center" style="height: 80px;">
        <div class="col-3 d-flex align-items-center justify-content-center">
          <img src="${bid.bidder.avatar.url}" class="rounded-circle img-fluid" alt="Profile Image" style="max-height: 100%;">
        </div>
        <div class="col d-flex align-items-center">
          <div class="bidder">
            <strong>@${bid.bidder.name}</strong> bid $${bid.amount}
          </div>
        </div>
      </div>`;
      });
    }
    return html;
  },
};
