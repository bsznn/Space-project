const aboutSection = document.querySelector(".section--about");
const statsSection = document.querySelector(".section--stats");
const totalResultsElement = document.querySelector(".result-total pre");
const resultContainer = document.querySelector(".result-list");
const genderSelect = document.getElementById("gender-select");
const searchInput = document.getElementById("search-input");
const loadMoreButton = document.getElementById("load-more");

const contentHide = document.querySelector(".content-hide");
const statsC = document.querySelector(".stats-c");
const statsId = document.getElementById("stats-id");

let allPeople = [];
let currentPage = 1;
const itemsPerPage = 10;

statsC.style.display = "none";
statsId.style.display = "none";

// Fonction pour récupérer toutes les personnes depuis l'API SWAPI
function getAllPeople() {
  let people = [];
  let url = "https://swapi.dev/api/people/";

  function retrievePeople(url) {
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
        people = people.concat(data.results);
        if (data.next) {
          return retrievePeople(data.next);
        } else {
          return people;
        }
      });
  }

  return retrievePeople(url);
}

// Fonction pour afficher les personnes filtrées selon les critères
function displayPeople(genderFilter = null, searchString = null) {
  getAllPeople()
    .then((people) => {
      allPeople = people;

      // Filtrer par genre si un filtre est sélectionné
      if (genderFilter) {
        allPeople = filterPeopleByGender(allPeople, genderFilter);
      }

      // Filtrer par recherche dans le nom de la personne
      if (searchString) {
        allPeople = allPeople.filter((person) =>
          person.name.toLowerCase().includes(searchString.toLowerCase())
        );
      }

      currentPage = 1;
      resultContainer.innerHTML = "";
      displayResults(allPeople.slice(0, itemsPerPage));
      updateLoadMoreButton();
    })
    .catch(() => {
      console.error("Erreur lors de l'affichage des personnes !");
    });
}

// Fonction pour afficher les résultats filtrés
function displayResults(people) {
  const peopleHTML = people
    .map(
      (person) => `
            <div class="result-row" data-url="${person.url}">
              <h4>${person.name}</h4>
              <p>${person.gender}</p>
            </div>
          `
    )
    .join("");

  const totalResults = allPeople.length;
  totalResultsElement.textContent = `${totalResults} résultat(s)`;
  resultContainer.innerHTML += peopleHTML;

  // Ajouter un écouteur d'événement pour chaque résultat de personne
  const personRows = document.querySelectorAll(".result-row");
  personRows.forEach((row) => {
    row.addEventListener("click", () => {
      const selectedPersonUrl = row.dataset.url;
      displayPersonStats(selectedPersonUrl);
    });
  });
}

// Fonction pour afficher les détails d'une personne
function displayPersonStats(personUrl) {
  fetch(personUrl)
    .then((response) => response.json())
    .then((person) => {
      document.querySelector(".stats-c h3").textContent = person.name;
      document.querySelector(".stats-c span").textContent = person.gender;
      const statsNumbers = document.querySelectorAll(".stats__number");
      statsNumbers[0].textContent = person.height;
      statsNumbers[1].textContent = person.mass;
      statsNumbers[2].textContent = person.eye_color;
      statsNumbers[3].textContent = person.hair_color;

      contentHide.style.display = "none";
      statsC.style.display = "block";
      statsId.style.display = "flex";
    })
    .catch((error) => {
      console.error(
        "Erreur lors de la récupération des détails de la personne :",
        error
      );
    });
}

// Fonction pour mettre à jour le bouton "Charger plus"
function updateLoadMoreButton() {
  if (currentPage * itemsPerPage >= allPeople.length) {
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
  displayResults(allPeople.slice(start, end));
  updateLoadMoreButton();
}

// Fonction pour filtrer les personnes par genre
function filterPeopleByGender(people, genderFilter) {
  return people.filter(
    (person) => person.gender.toLowerCase() === genderFilter.toLowerCase()
  );
}

// Ajout des écouteurs d'événements pour le filtre et la recherche
genderSelect.addEventListener("change", () => {
  const selectedGender = genderSelect.value;
  displayPeople(selectedGender, searchInput.value.trim());
});

searchInput.addEventListener("input", () => {
  const searchString = searchInput.value.trim().toLowerCase();
  displayPeople(genderSelect.value, searchString);
});

loadMoreButton.addEventListener("click", loadMoreResults);

displayPeople();
