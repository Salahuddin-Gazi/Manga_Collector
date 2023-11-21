import accumulate_chapter_html from "./accumulate_chapter_html.js";
import accumulateManga from "./accumulate_manga.js";
import {
  selector,
  isValidUrl,
  extractMangaNameFromUrl,
  addHiddenClass,
  name_generator,
} from "./utils.js";

const submitButton = selector("#btn-submit");
// console.log(submitButton);

if (submitButton) {
  submitButton.addEventListener("click", (e) => {
    addHiddenClass();
    selector(".chapter-loading").classList.contains("is-hidden") &&
      selector(".chapter-loading").classList.remove("is-hidden");
    var formInput = selector("#search-form input");
    var formInputValue = formInput?.value;
    if (formInputValue) {
      formInput.value = "";
      // console.log(formInputValue);
      if (isValidUrl(formInputValue)) {
        // console.log("valid ...");
        var manga_name;
        if (formInputValue.includes("/read-online/")) {
          manga_name = extractMangaNameFromUrl(
            formInputValue,
            (read_online = true)
          );
        }
        manga_name = extractMangaNameFromUrl(formInputValue);
        if (manga_name) {
          // console.log("name", manga_name);
          var url = `https://mangasee123.com/manga/${manga_name}`;
          accumulateManga(url, manga_name);
        }
      } else {
        // console.log("search input ...");
        var manga_name = name_generator(formInputValue);
        var searchUrl = `https://mangasee123.com/manga/${manga_name}`;
        accumulateManga(searchUrl, manga_name);
      }
    }
    e.preventDefault();
  });
}

var collectButton = selector("#btn-collect");

if (collectButton) {
  collectButton.addEventListener("click", (e) => {
    // console.log(e.target);
    // e.preventDefault();
    selector(".show-chapters").innerHTML = "";
    var error_range_value = selector(".error-range-value");
    !error_range_value.classList.contains("is-hidden") &&
      error_range_value.classList.add("is-hidden");

    selector(".chapter-loading").classList.contains("is-hidden") &&
      selector(".chapter-loading").classList.remove("is-hidden");

    var startValue = selector('input[name="start-value"]').value;
    var maxValue = selector('input[name="start-value"]').getAttribute("max");
    var endValue = selector('input[name="end-value"]').value;
    // console.log(startValue, endValue);
    if (startValue.length > 0) {
      startValue = parseInt(startValue);
      maxValue = maxValue ? parseInt(maxValue) : null;
      if (startValue <= maxValue) {
        var chapterToBeCollect = [startValue];
        if (endValue) {
          endValue = parseInt(endValue);
          if (endValue <= maxValue) {
            var temp;
            startValue > endValue &&
              ((temp = startValue), (startValue = endValue), (endValue = temp));
            chapterToBeCollect = [startValue, endValue];
          }
        }
        var mangaMaxChapter = selector(
          'input[name="manga-max-chapter"]'
        )?.value;
        var manga_name = selector('input[name="manga-name"]')?.value;
        //   console.log(mangaMaxChapter, manga_name);
        if (mangaMaxChapter && manga_name) {
          mangaMaxChapter = parseInt(mangaMaxChapter);
          var availableChapters = Array.from(
            { length: mangaMaxChapter },
            (_, i) => i + 1
          );
          var availableChapterLinks = availableChapters.map(
            (chapter) =>
              `https://mangasee123.com/read-online/${manga_name}-chapter-${chapter}.html`
          );
          // console.log(availableChapters, availableChapterLinks);

          var chapters =
            chapterToBeCollect.length < 2
              ? [availableChapterLinks[chapterToBeCollect[0] - 1]]
              : availableChapterLinks.slice(
                  chapterToBeCollect[0] - 1,
                  chapterToBeCollect[1]
                );

          if (chapters.length > 0) {
            // console.log(chapters);
            accumulate_chapter_html(chapters, manga_name, chapterToBeCollect);
          }
        }
        e.preventDefault();
      } else {
        error_range_value.classList.contains("is-hidden") &&
          error_range_value.classList.remove("is-hidden");
      }
    }
  });
}
