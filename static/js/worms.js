import errors from "./errors";
import { showError, cleanErrors } from "./errors";
import { addPlaceHolderBorders } from "./css_injector";

const button = document.getElementById("worms");
button.addEventListener("click", getSearchInfo);

function getFormInfo() {
  const elSpecies = document.getElementById("species");
  const elGenus = document.getElementById("genus");
  const species = elSpecies.value;
  const genus = elGenus.value;
  getWorms(genus, species);
  document.getElementById("loading-state").classList.add("active");
}

function cleanFields() {
  const fields = document.querySelectorAll(
    "#taxForm input:not([type='search'])"
  );
  for (let i = 0; i < fields.length; i++) {
    fields[i].value = "";
  }
}

function getSearchInfo() {
  const searchBox = document.getElementById("taxonomy-search").value.split(" ");

  const genus = searchBox[0];
  const species = searchBox[1];
  const spinner = document.getElementById("whales-spinner");
  spinner.classList.remove("u-hidden");
  document.getElementById("taxForm").classList.add("u-hidden");
  getWorms(genus, species);
}

function getWorms(genus, species) {
  const url = species
    ? `http://www.marinespecies.org/rest/AphiaRecordsByMatchNames?scientificnames%5B%5D=${genus}%20${species}&marine_only=true`
    : `http://www.marinespecies.org/rest/AphiaRecordsByMatchNames?scientificnames%5B%5D=${genus}&marine_only=true`;

  cleanErrors("Error", "searchTaxContainer");
  cleanFields();
  fetch(url)
    .then(response => {
      document.getElementById("whales-spinner").classList.add("u-hidden");
      document.getElementById("taxForm").classList.remove("u-hidden");
      return response.json();
    })
    .then(json => {
      displayResponse(json);
      addPlaceHolderBorders("taxonomy-data");
    })
    .catch(error => {
      // when there aren't results,it just returns an empty response
      // and triggers an error
      console.error(error);

      // clean just inc ase, there was a double error issue # 88
      cleanErrors("Error", "searchTaxContainer");
      showError("searchTaxContainer", errors.noTaxnomoniesFound, false);
      updateiFrameDisplay("http://www.marinespecies.org/aphia.php?p=search");
    });
}

function displayResponse(response) {
  response[0].map(item => {
    for (const prop in item) {
      // if form field exists, fill in with data from API
      const field = document.getElementById(prop);
      if (field) {
        field.value = item[prop];
        field.classList.add("dynamic");
      }
      if (prop == "url") {
        updateiFrameDisplay(item[prop]);
      }
    }
  });
}

function updateiFrameDisplay(url) {
  const iframe = document.getElementById("worms-iframe");
  iframe.src = url;
}
