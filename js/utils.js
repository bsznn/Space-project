const statsNumbers = document.querySelectorAll(".stats__number");
const statsDate = document.querySelector(".stats__date");

const PEOPLE_INDEX = 0;
const VEHICLES_INDEX = 1;
const PLANETS_INDEX = 2;

function updateStats(index, count) {
  statsNumbers[index].textContent = count;
}

function updateMissionDate(date) {
  statsDate.textContent = date;
}

function handleFetchError(entity) {
  console.error(`Erreur lors de la récupération des données des ${entity} !`);
}

function fetchData(url, entity, updateFunction, index) {
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      updateFunction(index, data.count);
      return data;
    })
    .catch(() => {
      handleFetchError(entity);
    });
}
