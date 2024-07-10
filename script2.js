const aboutSection = document.querySelector(".section--about");
const statsSection = document.querySelector(".section--stats");
const totalResultsElement = document.querySelector(".result-total pre");
const resultContainer = document.querySelector(".result-list");
const populationSelect = document.getElementById("population-select");
const searchInput = document.getElementById("search-input");
const loadMoreButton = document.getElementById("load-more");

const contentHide = document.querySelector(".content-hide");
const statsC = document.querySelector(".stats-c");
const statsId = document.getElementById("stats-id");

let allPlanets = [];
let currentPage = 1;
const itemsPerPage = 10;

statsC.style.display = "none";
statsId.style.display = "none";

function getAllPlanets() {
  let planets = [];
  let url = "https://swapi.dev/api/planets/";

  function retrievePlanets(url) {
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
        planets = planets.concat(data.results);
        if (data.next) {
          return retrievePlanets(data.next);
        } else {
          return planets;
        }
      });
  }

  return retrievePlanets(url);
}

function displayPlanets(populationRange = null, searchString = null) {
  getAllPlanets()
    .then((planets) => {
      allPlanets = planets;

      if (populationRange) {
        allPlanets = filterPlanetsByPopulation(allPlanets, populationRange);
      }

      if (searchString) {
        allPlanets = allPlanets.filter((planet) =>
          planet.name.toLowerCase().includes(searchString.toLowerCase())
        );
      }

      currentPage = 1;
      resultContainer.innerHTML = "";
      displayResults(allPlanets.slice(0, itemsPerPage));
      updateLoadMoreButton();
    })
    .catch(() => {
      console.error("Erreur lors de l'affichage des planètes !");
    });
}

function displayResults(planets) {
  const planetsHTML = planets
    .map(
      (planet) => `
        <div class="result-row" data-url="${planet.url}">
          <h4>${planet.name}</h4>
          <p>${planet.terrain}</p>
        </div>
      `
    )
    .join("");

  const totalResults = allPlanets.length;
  totalResultsElement.textContent = `${totalResults} résultat(s)`;
  resultContainer.innerHTML += planetsHTML;

  const planetRows = document.querySelectorAll(".result-row");
  planetRows.forEach((row) => {
    row.addEventListener("click", () => {
      const selectedPlanetUrl = row.dataset.url;
      displayPlanetStats(selectedPlanetUrl);
    });
  });
}

function displayPlanetStats(planetUrl) {
  fetch(planetUrl)
    .then((response) => response.json())
    .then((planet) => {
      document.querySelector(".stats-c h3").textContent = planet.name;
      document.querySelector(".stats-c span").textContent = planet.population;
      const statsNumbers = document.querySelectorAll(".stats__number");
      statsNumbers[0].textContent = planet.diameter;
      statsNumbers[1].textContent = planet.climate;
      statsNumbers[2].textContent = planet.gravity;
      statsNumbers[3].textContent = planet.terrain;

      contentHide.style.display = "none";
      statsC.style.display = "block";
      statsId.style.display = "flex";
    })
    .catch((error) => {
      console.error(
        "Erreur lors de la récupération des détails de la planète :",
        error
      );
    });
}

function updateLoadMoreButton() {
  if (currentPage * itemsPerPage >= allPlanets.length) {
    loadMoreButton.style.display = "none";
  } else {
    loadMoreButton.style.display = "block";
  }
}

function loadMoreResults() {
  currentPage++;
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  displayResults(allPlanets.slice(start, end));
  updateLoadMoreButton();
}

function filterPlanetsByPopulation(planets, populationRange) {
  const [min, max] = populationRange.split("-");
  return planets.filter((planet) => {
    const population = parseInt(planet.population.replace(/,/g, ""));
    return population >= parseInt(min) && (!max || population <= parseInt(max));
  });
}

populationSelect.addEventListener("change", () => {
  const selectedRange = populationSelect.value;
  displayPlanets(selectedRange, searchInput.value.trim());
});

searchInput.addEventListener("input", () => {
  const searchString = searchInput.value.trim().toLowerCase();
  displayPlanets(populationSelect.value, searchString);
});

loadMoreButton.addEventListener("click", loadMoreResults);

displayPlanets();
