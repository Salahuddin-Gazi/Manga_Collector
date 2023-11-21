var selector = (str) => document.querySelector(str);
var selectors = (str) => document.querySelectorAll(str);

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

var addHiddenClass = () => {
  var addClass = (selector) =>
    !selector.classList.contains("is-hidden") &&
    selector.classList.add("is-hidden");

  var emptyInputError = selector(".empty-input-error");
  var linkInputError = selector(".link-input-error");
  var valueInputError = selector(".value-input-error");
  var availableSearches = selector(".available-searches");
  var availableChapters = selector(".available-chapters");
  var notFoundSearches = selector(".error-searches-not-found");

  emptyInputError && addClass(emptyInputError);
  linkInputError && addClass(linkInputError);
  valueInputError && addClass(valueInputError);
  availableSearches && addClass(availableSearches);
  availableChapters && addClass(availableChapters);
  notFoundSearches && addClass(notFoundSearches);
};

export {
  selector,
  selectors,
  isValidUrl,
  extractMangaNameFromUrl,
  addHiddenClass,
  name_generator,
};
