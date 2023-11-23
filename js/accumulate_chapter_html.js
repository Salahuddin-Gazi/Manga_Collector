import createPDF from "./createPDF.js";
import generate_chapters from "./generate_chapters.js";
import saveHtmlToFile from "./saveHtmlToFile.js";
import { selector, waitForElem } from "./utils.js";

const createInPageHTML = (chapterToView = {}, manga_name, allChapters) => {
  // console.log(findChapterWeb);
  if (chapterToView && Object.keys(chapterToView).length > 0) {
    // single chapter images
    var { chapter, images } = chapterToView;
    var imageLists = images
      .map(
        (image, idx) =>
          `<div class="image-content"><p class="image-title">Page ${
            idx + 1
          }</p><img src="${image}" alt="${chapter}" class="images"></div>`
      )
      .join("");

    // single chapter, chapter
    var chapterContents = `
      <div class="chapter-content mt-5">
        <p class="chapter-title" id="chapter-${chapter}">
          Chapter ${parseInt(chapter)}
        </p>
        ${imageLists}
      </div>
      `;

    // Overall Chapters List
    window.CurrChapter = parseInt(chapter);
    var chapterLists = `Chapters Available:  `,
      chaptersNotFound = "Chapter Missing:  ";
    allChapters.forEach((data) => {
      if (data.chapter) {
        var { chapter } = data;
        var ch = parseInt(chapter);
        if (!!ch) {
          chapterLists += `<p id="chapter-${ch}" class="chapter-links-to-view text-success btn btn-secondary${
            window.CurrChapter && window.CurrChapter == ch ? " is-active" : ""
          }" style="width: 40px; height: 40px;">${ch}</p>`;
        }
      }
    });
    // selector(".chapter-links").innerHTML = chapterLists;
    var missingChapters = window.MissingChapters;
    if (missingChapters.length > 0) {
      missingChapters.forEach(
        (chap) => (chaptersNotFound += `<p class="text-danger">${chap}</p>`)
      );
    } else {
      chaptersNotFound += `<p class="text-danger">0</p>`;
    }

    // Manga main content, one chapter
    var mainMangaContent = `
        <div class="manga-content pt-3">
          <h3 id="manga__name" class="text-center">${manga_name.replaceAll(
            "-",
            " "
          )}</h3>
          <div class="chapter-lists">
            <div class="chapter-links d-flex flex-wrap gap-4">${chapterLists}</div></div>
            <div class="chapter-not-found d-flex flex-wrap gap-4 mt-4">${chaptersNotFound}</div>
             <div class="guidance-text text-start">
                <p>Trying again may help you to avoid missing chapters.</p>
                <p>Best option is to try with a smaller range.</p>
             </div> 
            </div>
          </div>
          ${chapterContents}
      </div>`;

    // over all html for one chapter
    var html = `
        <div class="main-content">
          ${mainMangaContent}
    </div>
    `;

    // Inserting html to DOM
    selector(".show-chapters").innerHTML = html;
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
    //     // Too many requests at once causing issues
    //     // implemented a 1s delay requests
    setTimeout(
      () => {
        // console.log(urls[i]);
        promises.push(
          generate_chapters(urls[i], manga_name).then((res) => {
            //   Calculating & insering progess in DOM
            progress++;
            var progressInPercentage = parseInt(
              (progress / overAllProgess) * 100
            );
            //   console.log(progressInPercentage + "%");
            if (progressInPercentage >= 0 && progressInPercentage <= 100) {
              selector(".chapter-prgress-percentage").textContent =
                progressInPercentage + "%";
            }
            if (!res.error) {
              findChapterWeb.push(res);
            } else {
              console.log("Error occured");
            }
            // console.log(res);
          })
        );
      },
      1000 * i,
      i
    );
  }

  setTimeout(() => {
    Promise.all(promises)
      .then(function () {
        // console.log(findChapterWeb);
        var findChapterWebSorted = findChapterWeb.sort(
          (a, b) => a.chapter - b.chapter
        );
        // console.log(findChapterWebSorted);

        var allChapters = [],
          missingChapters = [];
        if (chapterToBeCollect[1]) {
          for (let i = chapterToBeCollect[0]; i <= chapterToBeCollect[1]; i++) {
            allChapters.push(i);
          }
        } else {
          allChapters.push(chapterToBeCollect[0]);
        }

        if (allChapters.length > 0) {
          for (var i = 0; i < allChapters.length; i++) {
            var chapter = allChapters[i];
            var isFound =
              findChapterWebSorted.filter((data) => {
                if (data.chapter) {
                  var ch = parseInt(data.chapter);
                  // console.log(ch);
                  // console.log(ch, ch == chapter);
                  return ch == chapter;
                }
                return false;
              }).length > 0;
            // console.log(isFound);
            if (!isFound) missingChapters.push(chapter);
          }
          // console.log("missingChapters", missingChapters);
          window.MissingChapters = missingChapters;
        }

        createInPageHTML(
          findChapterWebSorted[0],
          manga_name,
          findChapterWebSorted
        );

        function showChapterClickEvent({ target }) {
          // console.log(target, target.closest(".chapter-links-to-view"));
          if (target.closest(".chapter-links-to-view")) {
            // console.log(target);

            selector(".show-chapters").innerHTML = "";

            var chapterNumber = target.textContent
              ? parseInt(target.textContent)
              : null;
            if (!!chapterNumber) {
              window.CurChapter = chapterNumber;
              var currentChapter = findChapterWebSorted.filter((data) => {
                if (data.chapter) {
                  return parseInt(data.chapter) == chapterNumber;
                }
              })?.[0];

              if (!!currentChapter) {
                createInPageHTML(
                  currentChapter,
                  manga_name,
                  findChapterWebSorted
                );
              }
            }
          }
        }

        selector(".dowload-button-container") &&
          (selector(".dowload-button-container").innerHTML = "");
        if (selector(".dowload-button-container")) {
          selector(".dowload-button-container").innerHTML = `
            <p class="pt-5">Download Options</p>
            <button class="btn-gray download-as-html py-2 px-3" type="button">
              Download HTML
            </button>
            <button class="btn-red download-as-pdf py-2 px-3" type="button">
              Download PDF
            </button>`;
        }

        // Adding click events to buttons, pdf and html
        waitForElem(
          ".manga__name, .download-as-pdf, .download-as-html, .chapter-content, .chapter-links",
          () => {
            var manga_name_elem = selector("#manga__name");
            var buttonPDF = selector(".download-as-pdf");
            var buttonHtml = selector(".download-as-html");
            var chapterContent = selector(".chapter-content");
            var chapterLinks = selector(".chapter-links");

            if (
              buttonPDF &&
              chapterContent &&
              buttonHtml &&
              manga_name_elem &&
              chapterLinks
            ) {
              selector(".dowload-button-container").classList.contains(
                "is-hidden"
              ) &&
                selector(".dowload-button-container").classList.remove(
                  "is-hidden"
                );

              // manga_name_elem.scrollIntoView({
              //   // buttonPDF.scrollIntoView({
              //   behavior: "smooth",
              // });
              setTimeout(() => {
                selector(".dowload-button-container").scrollIntoView({
                  behavior: "smooth",
                });
              }, 750);

              function buttonPDFEvent() {
                !selector(".dowload-button-container").classList.contains(
                  "is-hidden"
                ) &&
                  selector(".dowload-button-container").classList.add(
                    "is-hidden"
                  );
                // selector(".dowload-button-container") &&
                //   (selector(".dowload-button-container").innerHTML = "");

                !selector("#search-form").classList.contains("is-hidden") &&
                  selector("#search-form").classList.add("is-hidden");

                // console.log("clicked");

                selector(".chapter-loading").classList.contains("is-hidden") &&
                  selector(".chapter-loading").classList.remove("is-hidden");
                selector(".chapter-loading").scrollIntoView({
                  behavior: "smooth",
                });

                setTimeout(() => {
                  createPDF(
                    findChapterWebSorted,
                    manga_name,
                    chapterToBeCollect
                  );
                }, 500);
              }

              function buttonHTMLEvent() {
                console.log("Tried HTML");
                !selector(".dowload-button-container").classList.contains(
                  "is-hidden"
                ) &&
                  selector(".dowload-button-container").classList.add(
                    "is-hidden"
                  );
                // selector(".dowload-button-container") &&
                //   (selector(".dowload-button-container").innerHTML = "");

                var filename =
                  manga_name +
                  `-Chapter(${chapterToBeCollect[0]}${
                    chapterToBeCollect[1] ? `-${chapterToBeCollect[1]}` : ""
                  })` +
                  ".html";

                saveHtmlToFile(filename, manga_name, findChapterWebSorted);
              }

              buttonPDF.removeEventListener("click", buttonPDFEvent, true);
              buttonPDF.addEventListener("click", buttonPDFEvent, true);

              buttonHtml.removeEventListener("click", buttonHTMLEvent, true);
              buttonHtml.addEventListener("click", buttonHTMLEvent, true);

              if (selector(".show-chapters")) {
                // console.log(selector(".show-chapters"));
                selector(".show-chapters").removeEventListener(
                  "click",
                  showChapterClickEvent
                );
                selector(".show-chapters").addEventListener(
                  "click",
                  showChapterClickEvent
                );
              }
            }
          },
          3
        );

        !selector(".available-chapters").classList.contains("is-hidden") &&
          selector(".available-chapters").classList.add("is-hidden");
        !selector(".chapter-loading").classList.contains("is-hidden") &&
          selector(".chapter-loading").classList.add("is-hidden");
      })
      .finally(() => {
        !selector(".chapter-loading").classList.contains("is-hidden") &&
          selector(".chapter-loading").classList.add("is-hidden");
      });
  }, (overAllProgess + 1) * 1000);
}
