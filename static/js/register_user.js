import errorsList from "./errors";
import { showError, cleanErrors } from "./errors";
import { validateName } from "./helpers";


/**
 * Adds the user tring to session storage
 * @param {string} userName
 */
const addUser = userName => {
  sessionStorage.setItem("userName", userName);
};

/**
 * changes the window location to the long form
 */
const nextPage = () => {
  const nextLink = document.getElementById("next").href;
  window.location = nextLink;
};

/**
 * Validates that the user has entered something valid, if so
 * it adds the user to sessionStorage unser the "userName" key and
 * transports the user to the next form
 */
const validateAndRegisterUser = () => {
  cleanErrors("Error", "name");
  sessionStorage.removeItem("longFormNoUserError");
  const nameValue = document.querySelector("#name").value;
  if (validateName(nameValue)) {
    addUser(nameValue);
    nextPage();
  } else {
    showError("name", errorsList.introIvalidUsername);
  }
};
const registerButton = document.querySelector("#registerUser");

registerButton.addEventListener("click", validateAndRegisterUser);

// check if an error from longform exists in the sessionStorage and display it
const longFormError = sessionStorage.getItem("longFormNoUserError");
if (longFormError) {
  showError("name", longFormError);
}
