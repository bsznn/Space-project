const aboutSection = document.querySelector(".section--about");
const statsSection = document.querySelector(".section--stats");
const totalResultsElement = document.querySelector(".result-total pre");
const resultContainer = document.querySelector(".result-list");
const priceSelect = document.getElementById("price-select");
const searchInput = document.getElementById("search-input");
const loadMoreButton = document.getElementById("load-more");

const contentHide = document.querySelector(".content-hide");
const statsC = document.querySelector(".stats-c");
const statsId = document.getElementById("stats-id");

let allVehicles = [];
let currentPage = 1;
const itemsPerPage = 10;

statsC.style.display = "none";
statsId.style.display = "none";

// Fonction pour récupérer tous les véhicules
function getAllVehicles() {
  let vehicles = [];
  let url = "https://swapi.dev/api/vehicles/";

  function retrieveVehicles(url) {
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Erreur lors de la récupération des données du serveur"
          );
        }
        return response.json();
      })
      .then((data) => {
        vehicles = vehicles.concat(data.results);
        if (data.next) {
          return retrieveVehicles(data.next);
        } else {
          return vehicles;
        }
      });
  }

  return retrieveVehicles(url);
}

// Fonction pour afficher les véhicules filtrés selon les critères
function displayVehicles(priceRange = null, searchString = null) {
  getAllVehicles()
    .then((vehicles) => {
      allVehicles = vehicles;

      // Filtrer par prix si une plage est sélectionnée
      if (priceRange) {
        allVehicles = filterVehiclesByPrice(allVehicles, priceRange);
      }

      // Filtrer par recherche dans le nom du véhicule
      if (searchString) {
        allVehicles = allVehicles.filter((vehicle) =>
          vehicle.name.toLowerCase().includes(searchString.toLowerCase())
        );
      }

      currentPage = 1;
      resultContainer.innerHTML = "";
      displayResults(allVehicles.slice(0, itemsPerPage));
      updateLoadMoreButton();
    })
    .catch(() => {
      console.error("Erreur lors de l'affichage des véhicules !");
    });
}

// Fonction pour afficher les résultats filtrés
function displayResults(vehicles) {
  const vehiclesHTML = vehicles
    .map(
      (vehicle) => `
        <div class="result-row" data-url="${vehicle.url}">
          <h4>${vehicle.name}</h4>
          <p>${vehicle.model}</p>
        </div>
      `
    )
    .join("");

  const totalResults = allVehicles.length;
  totalResultsElement.textContent = `${totalResults} résultat(s)`;
  resultContainer.innerHTML += vehiclesHTML;

  // Ajouter un écouteur d'événement pour chaque résultat de véhicule
  const vehicleRows = document.querySelectorAll(".result-row");
  vehicleRows.forEach((row) => {
    row.addEventListener("click", () => {
      const selectedVehicleUrl = row.dataset.url;
      displayVehicleStats(selectedVehicleUrl);
    });
  });
}

// Fonction pour afficher les détails d'un véhicule
function displayVehicleStats(vehicleUrl) {
  fetch(vehicleUrl)
    .then((response) => response.json())
    .then((vehicle) => {
      document.querySelector(".stats-c h3").textContent = vehicle.name;
      document.querySelector(".stats-c span").textContent =
        vehicle.cost_in_credits;
      const statsNumbers = document.querySelectorAll(".stats__number");
      statsNumbers[0].textContent = vehicle.model;
      statsNumbers[1].textContent = vehicle.manufacturer;
      statsNumbers[2].textContent = `${vehicle.crew} équipage, ${vehicle.passengers} passagers`;
      statsNumbers[3].textContent = vehicle.length;

      contentHide.style.display = "none";
      statsC.style.display = "block";
      statsId.style.display = "flex";
    })
    .catch((error) => {
      console.error(
        "Erreur lors de la récupération des détails du véhicule :",
        error
      );
    });
}

// Fonction pour mettre à jour le bouton "Charger plus"
function updateLoadMoreButton() {
  if (currentPage * itemsPerPage >= allVehicles.length) {
    loadMoreButton.style.display = "none";
  } else {
    loadMoreButton.style.display = "block";
  }
}

// Fonction pour charger plus de résultats
function loadMoreResults() {
  currentPage++;
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  displayResults(allVehicles.slice(start, end));
  updateLoadMoreButton();
}

// Fonction pour filtrer les véhicules par prix
function filterVehiclesByPrice(vehicles, priceRange) {
  const [min, max] = priceRange.split("-");
  return vehicles.filter((vehicle) => {
    const price = parseInt(vehicle.cost_in_credits.replace(/,/g, ""));
    return price >= parseInt(min) && (!max || price <= parseInt(max));
  });
}

// Ajout des écouteurs d'événements pour le filtre et la recherche
priceSelect.addEventListener("change", () => {
  const selectedRange = priceSelect.value;
  displayVehicles(selectedRange, searchInput.value.trim());
});

searchInput.addEventListener("input", () => {
  const searchString = searchInput.value.trim().toLowerCase();
  displayVehicles(priceSelect.value, searchString);
});

loadMoreButton.addEventListener("click", loadMoreResults);

displayVehicles();
