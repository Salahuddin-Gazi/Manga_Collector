var selector = (str) => document.querySelector(str);
var selectors = (strArr = []) => document.querySelectorAll(strArr);

const isValidUrl = (urlString) => {
  var urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // validate protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // validate fragment locator
  return !!urlPattern.test(urlString);
};

// Function to extract the manga name from the URL
function extractMangaNameFromUrl(url, read_online = false) {
  // Define a regular expression to match the manga name in the URL
  const regex = read_online
    ? /\/read-online\/([^\/]+)-chapter-\d+\.html/
    : /\/manga\/([^\/]+)$/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

const name_generator = (value) => {
  // console.log("vale", value);
  const wordsArr = value
    .trim()
    .toLowerCase()
    .replaceAll(":", "")
    .replaceAll("_", "")
    .replaceAll("#", "")
    .replaceAll(".", "")
    .replaceAll("%", "")
    .replaceAll("+", "")
    .split(" ");
  var name = wordsArr.map((word, idx) => {
    if (word == "the" && idx != 0) {
      return "the";
    }
    // if (word == "no" && idx != 0) {
    //   return "no";
    // }
    if (word == " ") return;
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  // console.log("name", name);
  return name.join("-");
};

var addClass = (selector) =>
  !selector.classList.contains("is-hidden") &&
  selector.classList.add("is-hidden");

var addHiddenClassToSearchError = () => {
  var emptyInputError = selector(".empty-input-error");
  var linkInputError = selector(".link-input-error");
  var valueInputError = selector(".value-input-error");
  emptyInputError && addClass(emptyInputError);
  linkInputError && addClass(linkInputError);
  valueInputError && addClass(valueInputError);
};

var addHiddenClass = () => {
  addHiddenClassToSearchError();

  var availableSearches = selector(".available-searches");
  // var availableChapters = selector(".available-chapters");
  var notFoundSearches = selector(".error-searches-not-found");
  var internalError = selector(".internal-error");
  var errorRangeInputInvalidValue = selector(
    ".error-range-input-invalid-value"
  );
  var errorRangeInputValue = selector(".error-range-input-value");
  var errorOutOfRangeValue = selector(".error-out-of-range-value");
  var downloadButtonContainer = selector(".dowload-button-container");
  var availableChapters = selector(".available-chapters");

  availableSearches && addClass(availableSearches);
  // availableChapters && addClass(availableChapters);
  internalError && addClass(internalError);
  notFoundSearches && addClass(notFoundSearches);
  errorRangeInputInvalidValue && addClass(errorRangeInputInvalidValue);
  errorRangeInputValue && addClass(errorRangeInputValue);
  errorOutOfRangeValue && addClass(errorOutOfRangeValue);
  availableChapters && addClass(availableChapters);
  downloadButtonContainer && addClass(downloadButtonContainer);
};

var waitFor = (wairFoFn, callback, timeout1 = 25, timeout2 = 2000) => {
  var timeout;
  timeout = setInterval(() => {
    if (wairFoFn) {
      clearInterval(timeout);
      callback();
    }
  }, timeout1);
  setTimeout(() => {
    clearInterval(timeout);
  }, timeout2);
};

const waitForElem = (waitFor, callback, minElements = 1, variable = false) => {
  const checkElements = () => {
    if (variable) {
      return waitFor;
    } else {
      return window.document.querySelectorAll(waitFor);
    }
  };

  var thisElem = checkElements(),
    timeOut;
  if (
    (!variable && thisElem.length >= minElements) ||
    (variable && typeof thisElem !== "undefined")
  ) {
    return callback(thisElem);
  } else {
    var interval = setInterval(() => {
      thisElem = checkElements();
      if (
        (!variable && thisElem.length >= minElements) ||
        (variable && typeof thisElem !== "undefined")
      ) {
        clearInterval(interval);
        clearTimeout(timeOut);
        return callback(thisElem);
      }
    }, 20);
    timeOut = setTimeout(() => {
      // Fallback
      clearInterval(interval);
      return callback(false);
    }, 10000);
  }
};

export {
  selector,
  selectors,
  isValidUrl,
  extractMangaNameFromUrl,
  addHiddenClass,
  addHiddenClassToSearchError,
  name_generator,
  waitForElem,
  waitFor,
};
