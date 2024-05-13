export const template = {
  header() {
    return `
<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
        <a class="navbar-brand" href="home.html">
            <img class="main-logo" src="../images/auction-house-logo.png" alt="Your Logo" width="auto">
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ml-auto">
                <li class="nav-item">
                    <a class="nav-link" href="../listings/index.html">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="../listings/index.html">Listings</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="../profile.html">Profile</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="../index.html">Logout</a>
                </li>
            </ul>
        </div>
    </div>
</nav>
                

`;
  },
};
