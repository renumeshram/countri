// Global Variables
let allCountries = [];
let favorites = [];
const maxFavorites = 5;
let isLoggedIn = false;
let displayedCountriesCount = 16;


// DOM Elements
const countryList = document.getElementById("country-list");
const languageFilter = document.getElementById("language-filter");
const regionFilter = document.getElementById("region-filter");
const countryDetailModal = document.getElementById("country-detail");
const closeModalButton = document.getElementById("close-detail");
const favoriteButton = document.getElementById("favorite-button");
const loginModal = document.getElementById("login-modal");
const closeLoginModalButton = document.getElementById("close-modal");
const signupModal = document.getElementById("signup-modal");
const closeSignupModalButton = document.getElementById("close-signup-modal");
const showMoreButton = document.getElementById("show-more");
const searchInput = document.getElementById("search");
const favoriteCountriesPage = document.getElementById("favorite-countries-page");
const favoriteCountriesList = document.getElementById("favorite-countries-list");
const backToHomeButton = document.getElementById("back-to-home");
const favoritesToggle = document.getElementById("favorites-toggle");

// Fetching Countries Data
async function fetchCountries() {
    try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        allCountries = await response.json();
        displayCountries(allCountries.slice(0, displayedCountriesCount));
        populateLanguageFilter();
        populateRegionFilter();
    } catch (error) {
        console.error("Failed to fetch countries:", error);
        showNotification("Unable to fetch country data. Please try again later.");
    }
}

// Display Countries
function displayCountries(countries) {
    countryList.innerHTML = ""; // Clear previous country cards
    countries.forEach(country => {
        const card = document.createElement("div");
        card.className = "country-card";
        card.innerHTML = `
            <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" class="country-flag">
            <h4>${country.name.common}</h4>
            <p>${country.capital || "No Capital"}</p>
        `;
        card.addEventListener("click", () => showCountryDetail(country));
        countryList.appendChild(card);
    });
}

// Show Country Detail
function showCountryDetail(country) {
    document.getElementById("detail-flag").src = country.flags.svg;
    document.getElementById("detail-name").innerText = country.name.common;
    document.getElementById("detail-capital").innerText = country.capital || "N/A";
    document.getElementById("detail-region").innerText = country.region;
    document.getElementById("detail-population").innerText = country.population.toLocaleString();
    document.getElementById("detail-area").innerText = `${country.area} km²`;
    document.getElementById("detail-domain").innerText = country.tld ? country.tld.join(", ") : "N/A";
    document.getElementById("detail-languages").innerText = country.languages ? Object.values(country.languages).join(", ") : "N/A";

    // Update Favorite Button
    if (favorites.includes(country.name.common)) {
        favoriteButton.innerText = "Unfavorite";
        favoriteButton.style.backgroundColor = "#e64a19";
    } else {
        favoriteButton.innerText = "Favorite";
        favoriteButton.style.backgroundColor = "#3f25fd";
    }

    countryDetailModal.style.display = "block"; // Show modal
}

// Populate Language Filter
function populateLanguageFilter() {
    const languages = new Set(allCountries.flatMap(country => Object.values(country.languages || {})));
    languages.forEach(language => {
        const option = document.createElement("option");
        option.value = language;
        option.innerText = language;
        languageFilter.appendChild(option);
    });
}

// Populate Region Filter
function populateRegionFilter() {
    const regions = [...new Set(allCountries.map(country => country.region))];
    regions.forEach(region => {
        const option = document.createElement("option");
        option.value = region;
        option.innerText = region;
        regionFilter.appendChild(option);
    });
}

// Search Functionality
searchInput.addEventListener("input", function() {
    const query = this.value.toLowerCase();
    const filteredCountries = allCountries.filter(country => 
        country.name.common.toLowerCase().includes(query)
    );
    displayCountries(filteredCountries.slice(0, displayedCountriesCount));
});

// Filter Functionality
languageFilter.addEventListener("change", filterCountries);
regionFilter.addEventListener("change", filterCountries);

function filterCountries() {
    const selectedLanguage = languageFilter.value;
    const selectedRegion = regionFilter.value;

    const filteredCountries = allCountries.filter(country => {
        const hasLanguage = selectedLanguage ? Object.values(country.languages || {}).includes(selectedLanguage) : true;
        const hasRegion = selectedRegion ? country.region === selectedRegion : true;
        return hasLanguage && hasRegion;
    });

    displayCountries(filteredCountries.slice(0, displayedCountriesCount));
}

// Load More Countries
showMoreButton.addEventListener("click", () => {
    displayedCountriesCount += 10;
    displayCountries(allCountries.slice(0, displayedCountriesCount));
});

// Close Modals
const closeModals = () => {
    countryDetailModal.style.display = "none";
    loginModal.style.display = "none";
    signupModal.style.display = "none";
    favoriteCountriesPage.style.display = "none"; // Ensure favorites page is also closed
};

closeModalButton.addEventListener("click", closeModals);
closeLoginModalButton.addEventListener("click", closeModals);
closeSignupModalButton.addEventListener("click", closeModals);

// Favorite Button Functionality with Login Check
favoriteButton.addEventListener("click", () => {
    if (!isLoggedIn) {
        // Show a pop-up prompting the user to log in
        alert("Please log in to add favorites.");
        return;
    }

    const countryName = document.getElementById("detail-name").innerText;
    if (favorites.includes(countryName)) {
        favorites = favorites.filter(name => name !== countryName);
        favoriteButton.innerText = "Favorite";
        favoriteButton.style.backgroundColor = "#3f25fd";
        showNotification(`${countryName} has been removed from favorites.`);
    } else {
        if (favorites.length < maxFavorites) {
            favorites.push(countryName);
            favoriteButton.innerText = "Unfavorite";
            favoriteButton.style.backgroundColor = "#e64a19";
            showNotification(`${countryName} has been added to favorites.`);
        } else {
            alert(`You can only have ${maxFavorites} favorites.`);
        }
    }
});

// Login and Signup Functionality
document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    isLoggedIn = true;
    showNotification("Logged in successfully!");
    closeLoginModalButton.click();

});

document.getElementById("signup-form").addEventListener("submit", (e) => {
    e.preventDefault();
    isLoggedIn = true;
    showNotification("Signed up and logged in successfully!");
    closeSignupModalButton.click();
});



// DOM Elements
const loginButton = document.getElementById("open-login");
const logoutButton = document.getElementById("logout-button");
const userInfoSection = document.getElementById("user-info");
const signupButton = document.getElementById("open-signup")

// Login Form Submission
document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    // Mock login logic (replace with real authentication logic)
    isLoggedIn = true;
    showNotification("Logged in successfully!");
    updateLoginStatus();
    closeLoginModalButton.click();
});

// Logout Button Click
logoutButton.addEventListener("click", () => {
    isLoggedIn = false;
    showNotification("Logged out successfully!");
    updateLoginStatus();
});

// Update Login Status
function updateLoginStatus() {
    if (isLoggedIn) {
        loginButton.style.display = "none";  // Hide login button
        signupButton.style.display = "none";  // Hide signup button
        logoutButton.style.display = "inline-block";  // Show logout button
        userInfoSection.style.display = "inline-block";  // Show user info section
    } else {
        loginButton.style.display = "inline-block";  // Show login button
         signupButton.style.display = "inline-block"; 
        logoutButton.style.display = "none";  // Hide logout button
        userInfoSection.style.display = "none";  // Hide user info section
    }
}

// Initial Setup
updateLoginStatus();


// Show Login/Signup Modals
document.querySelectorAll(".login-btn, .signup-btn").forEach(button => {
    button.addEventListener("click", () => {
        loginModal.style.display = button.classList.contains("login-btn") ? "block" : "none";
        signupModal.style.display = button.classList.contains("signup-btn") ? "block" : "none";
    });
});

// Show Favorite Countries
favoritesToggle.addEventListener("click", showFavoriteCountries);

function showFavoriteCountries() {
    favoriteCountriesPage.style.display = "block"; // Show favorite countries page
    favoriteCountriesList.innerHTML = ""; // Clear previous favorites
    favorites.forEach(name => {
        const country = allCountries.find(c => c.name.common === name);
        if (country) {
            const countryElement = document.createElement("div");
            countryElement.className = "favorite-country";
            countryElement.innerHTML = `
                <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" class="country-flag">
                <h4>${country.name.common}</h4>
                <p>${country.capital || "No Capital"}</p>
            `;
            favoriteCountriesList.appendChild(countryElement);
        }
    });
}

// Back to Home Functionality
backToHomeButton.addEventListener("click", () => {
    favoriteCountriesPage.style.display = "none"; // Hide favorite countries page
});

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.innerText = message;
    notification.className = 'notification';
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initial Fetch
fetchCountries();
