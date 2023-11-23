import get_manga from "./get_manga.js";
import { selector } from "./utils.js";

var setAvailableRangesToDom = (maxValue, manga_name) => {
  var availableChapters = selector(".available-chapters");
  if (availableChapters) {
    availableChapters.classList.contains("is-hidden") &&
      availableChapters.classList.remove("is-hidden");

    availableChapters.querySelector(".range-end").textContent = maxValue;
    availableChapters.querySelector('input[name="manga-max-chapter"]').value =
      maxValue;
    selector('input[name="start-value"]').setAttribute("max", maxValue);
    selector('input[name="end-value"]').setAttribute("max", maxValue);
    availableChapters.querySelector('input[name="manga-name"]').value =
      manga_name;
    availableChapters.querySelector(".manga-name").textContent =
      manga_name.replaceAll("-", " ");
  }
  !selector(".chapter-loading").classList.contains("is-hidden") &&
    selector(".chapter-loading").classList.add("is-hidden");
};

export default async function accumulateManga(url, manga_name) {
  try {
    const latestChapter = await get_manga(url);
    if (latestChapter && latestChapter.chapter) {
      // console.log(latestChapter);
      const { chapter } = latestChapter;
      if (typeof chapter == "number") {
        selector(".available-chapters") &&
          selector(".available-chapters").classList.contains("is-hidden") &&
          selector(".available-chapters").classList.remove("is-hidden");

        selector(".show-chapters") &&
          (selector(".show-chapters").innerHTML = "");

        setAvailableRangesToDom(chapter, manga_name);
      } else {
        selector(".error-searches-not-found").classList.contains("is-hidden") &&
          selector(".error-searches-not-found").classList.remove("is-hidden");
        !selector(".chapter-loading").classList.contains("is-hidden") &&
          selector(".chapter-loading").classList.add("is-hidden");
      }
    }
  } catch (error) {
    selector(".internal-error").classList.contains("is-hidden") &&
      selector(".internal-error").classList.remove("is-hidden");
    !selector(".chapter-loading").classList.contains("is-hidden") &&
      selector(".chapter-loading").classList.add("is-hidden");
  }
}
