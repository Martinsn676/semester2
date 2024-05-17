export const template = {
  header() {
    return `
<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
        <a class="navbar-brand" href="../listings/index.html">
            <img class="main-logo" src="../images/auction-house-logo.png" alt="Your Logo" width="auto">
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <button type="button" class="add-listing-button btn btn-primary" data-toggle="modal" data-target="#addListingModal">
            Add Listing
        </button>
        <div class="collapse navbar-collapse  justify-content-lg-end" id="navbarNav">
            <ul class="text-center navbar-nav flex-column flex-lg-row align-items-lg-center">
                <li class="nav-item">
                    <a class="nav-link" href="../listings/index.html">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="../listings/index.html">Listings</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="../profile/index.html">Profile</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link sign-out-button" href="../index.html">Logout</a>
                </li>
                <li id="credit-count" class="list-group-item d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                        <img src="https://t4.ftcdn.net/jpg/04/54/19/43/360_F_454194340_S5Dxu8CJilzPGmqSU44azVccOuvvEj1i.jpg" alt="Account Icon" class="rounded-circle mr-3 account-icon">
                        <div class="mr-3">
                            <h5 class="mb-0">Credits</h5>
                        </div>
                    </div>
                    <span class="badge badge-success badge-pill">65</span>
                </li>
            </ul>
        </div>
    </div>
</nav>


`;
  },
  headerGuest() {
    return `
<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
        <a class="navbar-brand" href="home.html">
            <img class="main-logo" src="../images/auction-house-logo.png" alt="Your Logo" width="auto">
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
<button type="button" class="btn btn-primary disabled" data-bs-toggle="modal" data-bs-target="#addListingModal" disabled>
  Add Listing
</button>

        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul class="navbar-nav flex-row align-items-center">
                <li class="nav-item">
                    <a class="nav-link" href="../listings/index.html">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="../listings/index.html">Listings</a>
                </li>
                <li class="nav-item">
                    <a href="../index.html" class="btn btn-primary">Sign in</a>
                </li>
            </ul>
        </div>
    </div>
</nav>`;
  },
};
