import createPDF from "./createPDF.js";
import generate_chapters from "./generate_chapters.js";
import saveHtmlToFile from "./saveHtmlToFile.js";
import { selector } from "./utils.js";

const createInPageHTML = (findChapterWeb, manga_name, chapterToBeCollect) => {
  // console.log(findChapterWeb);
  if (findChapterWeb.length > 0) {
    var chapterLists = "Chapters";
    var chapterContents = findChapterWeb.map((data) => {
      if (data.chapter && data.images.length > 0) {
        var { chapter, images } = data;
        // console.log(chapter);
        chapterLists += `<a href="#chapter-${chapter}" class="text-success">${parseInt(
          chapter
        )}</a>
`;
        var imageLists = images.map(
          (image, idx) =>
            `<div class="image-content"><p class="image-title">Page ${
              idx + 1
            }</p><img src="${image}" alt="${chapter}" class="images"></div>`
        );
        return `<div class="chapter-content">
  <p class="chapter-title" id="chapter-${chapter}">Chapter ${parseInt(
          chapter
        )}</p>
  ${imageLists}
</div>
`;
      }
    });

    var mainMangaContent = `<div class="manga-content py-5">
    <h3>${manga_name.replaceAll("-", " ")}</h3>
    <div class="chapter-lists my-2">
      <div class="chapter-links d-flex flex-wrap gap-3">${chapterLists}</div>
    </div>
    ${chapterContents.join("")}
  </div>`;

    var html = `<div class="main-content">
  <button
    class="btn-red btn-success my-3 download-as-html py-2 px-3"
    type="button"
  >
    Download HTML
  </button>
  <button class="btn-red my-3 download-as-pdf py-2 px-3" type="button">
    Download PDF
  </button>
  ${mainMangaContent}
</div>
`;

    selector(".show-chapters").innerHTML = html;
    var timeout;
    clearInterval(timeout);
    timeout = setInterval(() => {
      var button = selector(".download-as-pdf");
      var buttonHtml = selector(".download-as-html");
      var chapterContent = selector(".chapter-content");
      if (button && chapterContent && buttonHtml) {
        selector(".download-as-pdf").classList.contains("is-hidden") &&
          selector(".download-as-pdf").classList.remove("is-hidden");
        clearInterval(timeout);
        // chapterContent.scrollIntoView({
        button.scrollIntoView({
          behavior: "smooth",
        });
        button.addEventListener("click", () => {
          !selector(".download-as-pdf").classList.contains("is-hidden") &&
            selector(".download-as-pdf").classList.add("is-hidden");
          console.log("clicked");
          //   saveHtmlToFile(html, filename, manga_name);
          selector(".chapter-loading").classList.contains("is-hidden") &&
            selector(".chapter-loading").classList.remove("is-hidden");
          selector(".chapter-loading").scrollIntoView({
            behavior: "smooth",
          });
          setTimeout(() => {
            createPDF(findChapterWeb, manga_name, chapterToBeCollect);
          }, 500);
        });
        buttonHtml.addEventListener("click", () => {
          const filename =
            manga_name +
            `-Chapter(${chapterToBeCollect[0]}${
              chapterToBeCollect[1] ? `-${chapterToBeCollect[1]}` : ""
            })` +
            ".html";

          saveHtmlToFile(mainMangaContent, filename, manga_name);
        });
      }
    }, 25);

    setTimeout(() => {
      clearInterval(timeout);
    }, 5000);
  }
};

export default function accumulate_chapter_html(
  urls,
  manga_name,
  chapterToBeCollect
) {
  let findChapterWeb = new Array();
  var promises = [];
  var progress = 0;
  var overAllProgess = urls.length;
  for (let i = 0; i < urls.length; i++) {
    // console.log(urls[i]);
    promises.push(
      generate_chapters(urls[i], manga_name).then((res) => {
        //   Calculating & insering progess in DOM
        progress++;
        var progressInPercentage = parseInt((progress / overAllProgess) * 100);
        //   console.log(progressInPercentage + "%");
        if (progressInPercentage >= 0 && progressInPercentage <= 100) {
          selector(".chapter-prgress-percentage").textContent =
            progressInPercentage + "%";
        }
        findChapterWeb.push(res);
        // console.log(res);
      })
    );
  }
  Promise.all(promises)
    .then(function () {
      // console.log(findChapterWeb);
      var findChapterWebSorted = findChapterWeb.sort(
        (a, b) => a.chapter - b.chapter
      );
      // console.log(findChapterWebSorted);
      createInPageHTML(findChapterWebSorted, manga_name, chapterToBeCollect);
      // createPDF(findChapterWeb, manga_name, chapterToBeCollect);
      !selector(".available-chapters").classList.contains("is-hidden") &&
        selector(".available-chapters").classList.add("is-hidden");
      !selector(".chapter-loading").classList.contains("is-hidden") &&
        selector(".chapter-loading").classList.add("is-hidden");
    })
    .finally(() => {
      !selector(".chapter-loading").classList.contains("is-hidden") &&
        selector(".chapter-loading").classList.add("is-hidden");
    });
}
