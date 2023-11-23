import back_to_top_button from "./back_to_top_button.js";
import { selector } from "./utils.js";

var style = `<style>
  .is-hidden {
    display: none !important;
  }

  .btn-success {
    color: #fff !important;
    background-color: #198754 !important;
    border-color: #198754 !important;
  }

  .chapter-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .chapter-title {
    padding: 5px 10px;
    border: solid 5px #ffbb00;
    /* margin: 28px 0; */
    /* max-width: 220px; */
    font-weight: bold;
    font-size: 20px;
    text-align: center;
    background: red;
    color: white;
  }
  .image-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    padding: 50px 20px;
  }
  .image-content:not(:first-child) {
    border-top: solid 20px #aaa;
  }
  .image-title {
    display: block;
    font-weight: bold;
    font-size: 28px;
    font-style: italic;
    text-align: center;
    text-decoration: underline;
  }
  .images {
    width: 100%;
  }

  #btn-back-to-top {
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: none;
  }

  .chapter-links {
    font-weight: 600;
    font-size: 18px;
  }

  .chapter-links-to-view {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    -khtml-border-radius: 50%;
    border-radius: 50%;
    padding: 10px;
    border: none;
    color: #fdfdfe !important;
    font-weight: 600;
    transition: all 0.3s;
  }

  .chapter-links-to-view.is-active {
    line-height: 0.5;
    background: red;
    box-shadow: 0 4px 10px rgba(255, 86, 63, 0.4);
  }

  .download-as-html {
    font-weight: 600;
    border-radius: 12px;
  }

  .dowload-button-container {
    padding: 25px 0 17px;
    border: 2px solid red;
    position: relative;
  }

  .dowload-button-container p {
    position: absolute;
    top: -19px;
    left: 50%;
    transform: translateX(-50%);
    background: #fff;
    font-size: 18px;
    padding: 5px;
    width: calc(100% - 130px);
    font-weight: 600;
    max-width: 250px;
  }

  #manga__name {
    font-weight: 600;
    margin-bottom: 3rem;
  }

  @media screen and (max-width: 360px) {
    .dowload-button-container {
      gap: 0;
    }
  }
</style>
`;

var codeString = `
if (document.querySelector(".chapter-links")) {
  var chapterLinksContainer = document.querySelector(".chapter-links");
  chapterLinksContainer.addEventListener("click", ({ target }) => {
    if (target.closest(".chapter-links-to-view")) {
      var chapter = target.textContent;

      document
        .querySelector(".chapter-links-to-view.is-active")
        ?.classList.remove("is-active");

      !document
        .querySelector(\`#chapter-\${chapter}\`)
        ?.classList.contains("is-active") &&
        document
          .querySelector(\`#chapter-\${chapter}\`)
          ?.classList.add("is-active");

      [...document.querySelectorAll(".chapter-content")].forEach(
        (content) =>
          !content.classList.contains("is-hidden") &&
          content.classList.add("is-hidden")
      );
      document
        .querySelector(\`.chapter-content-\${chapter}\`)
        ?.classList.contains("is-hidden") &&
        document
          .querySelector(\`.chapter-content-\${chapter}\`)
          ?.classList.remove("is-hidden");
    }
  });
}
`;

const createInPageHTML = (findChapterWeb, manga_name) => {
  // console.log(findChapterWeb);
  if (findChapterWeb.length > 0) {
    var chapterLists = `Chapters Available:  `;

    var chapterContents = findChapterWeb.map((data, idx) => {
      if (data.chapter && data.images.length > 0) {
        var { chapter, images } = data;

        var ch = parseInt(chapter);
        chapterLists += `<p id="chapter-${ch}" class="chapter-links-to-view text-success btn btn-secondary${
          idx == 0 ? " is-active" : ""
        }" style="width: 40px; height: 40px;">${ch}</p>`;

        var imageLists = images.map(
          (image, idx) =>
            `<div class="image-content"><p class="image-title">Page ${
              idx + 1
            }</p><img src="${image}" alt="${chapter}" class="images"></div>`
        );

        return `
        <div class="chapter-content${
          idx > 0 ? ` is-hidden` : ``
        } chapter-content-${ch} mt-5">
          <p class="chapter-title" id="chapter-${ch}">Chapter ${ch}</p>
          ${imageLists}
        </div>`;
      }
    });

    var mainMangaContent = `
    <div class="manga-content pt-3">
      <h3 class='text-center'>${manga_name.replaceAll("-", " ")}</h3>
      <div class="chapter-lists">
        <div class="chapter-links d-flex flex-wrap gap-4">${chapterLists}</div>
      </div>
      ${chapterContents.join("")}
    </div>`;
    return mainMangaContent;
  }
};

export default function saveHtmlToFile(fileName, manga_name, allChapters) {
  console.log("From saveHtmlToFile");
  // console.log("htmlContent", htmlContent);
  var mainMangaContent = createInPageHTML(allChapters, manga_name);
  var html = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${manga_name.replaceAll("-", " ")}</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
      </head>
      ${style}
    </head>
    <body>
      <div class="container-lg">
      ${mainMangaContent}
      ${back_to_top_button}
      </div>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
      <script>${codeString}</script>
      </body>
  </html>
  `;

  selector(".dowload-button-container").classList.contains("is-hidden") &&
    selector(".dowload-button-container").classList.remove("is-hidden");

  const blob = new Blob([html], { type: "text/html" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
