import accumulate_chapter_html from "./accumulate_chapter_html.js";
import accumulateManga from "./accumulate_manga.js";
import {
  collectMangaFormValidation,
  submitSearchFormValidation,
} from "./form_validations.js";
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
  submitButton.addEventListener("click", () => {
    addHiddenClass();
    var formInput = selector("#search-form input");
    var formInputValue = formInput?.value;
    var { error } = submitSearchFormValidation(formInputValue);
    if (!error) {
      selector(".chapter-loading").classList.contains("is-hidden") &&
        selector(".chapter-loading").classList.remove("is-hidden");
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
  });
}

var collectButton = selector("#btn-collect");

if (collectButton) {
  collectButton.addEventListener("click", () => {
    // console.log("clicked");
    addHiddenClass();

    selector(".chapter-loading").classList.contains("is-hidden") &&
      selector(".chapter-loading").classList.remove("is-hidden");
    selector(".chapter-loading").scrollIntoView({
      behavior: "smooth",
    });
    selector(".show-chapters").innerHTML = "";

    var startValue = selector('input[name="start-value"]').value;
    var maxValue = selector('input[name="start-value"]').getAttribute("max");
    var endValue = selector('input[name="end-value"]').value;
    // console.log(startValue, endValue);

    const { error } = collectMangaFormValidation(startValue, maxValue);

    if (!error) {
      startValue = parseInt(startValue);
      maxValue = maxValue ? parseInt(maxValue) : null;
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

      var mangaMaxChapter = selector('input[name="manga-max-chapter"]')?.value;
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
    } else {
      !selector(".chapter-loading").classList.contains("is-hidden") &&
        selector(".chapter-loading").classList.add("is-hidden");
    }
  });
}
