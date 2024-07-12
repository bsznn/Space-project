function onInit() {
  getPeopleData();
}

function getPeopleData() {
  fetchData(
    "https://swapi.dev/api/people/",
    "personnes",
    updateStats,
    PEOPLE_INDEX
  ).then(() => getVehiclesData());
}

function getVehiclesData() {
  fetchData(
    "https://swapi.dev/api/vehicles/",
    "véhicules",
    updateStats,
    VEHICLES_INDEX
  ).then(() => getPlanetsData());
}

function getPlanetsData() {
  fetchData(
    "https://swapi.dev/api/planets/",
    "planètes",
    updateStats,
    PLANETS_INDEX
  ).then(() => {
    updateMissionDate("10 juin 2021");
  });
}

onInit();
