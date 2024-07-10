const statsNumbers = document.querySelectorAll(".stats__number");
const statsDate = document.querySelector(".stats__date");

function onInit() {
  getPeopleData();
}

function getPeopleData() {
  fetch("https://swapi.dev/api/people/")
    .then((response) => response.json())
    .then((data) => {
      updatePeopleStats(data.count);
      return getVehiclesData();
    })
    .catch(() => {
      console.error(
        "Erreur lors de la récupération des données des personnes !"
      );
    });
}

function getVehiclesData() {
  return fetch("https://swapi.dev/api/vehicles/")
    .then((response) => response.json())
    .then((data) => {
      updateVehiclesStats(data.count);
      return getPlanetsData();
    })
    .catch(() => {
      console.error(
        "Erreur lors de la récupération des données des véhicules !"
      );
    });
}

function getPlanetsData() {
  return fetch("https://swapi.dev/api/planets/")
    .then((response) => response.json())
    .then((data) => {
      updatePlanetsStats(data.count);
      updateMissionDate("10 juin 2021");
    })
    .catch(() => {
      console.error(
        "Erreur lors de la récupération des données des planètes !"
      );
    });
}

function updatePeopleStats(count) {
  statsNumbers[0].textContent = count;
}

function updateVehiclesStats(count) {
  statsNumbers[1].textContent = count;
}

function updatePlanetsStats(count) {
  statsNumbers[2].textContent = count;
}

function updateMissionDate(date) {
  statsDate.textContent = date;
}

onInit();
