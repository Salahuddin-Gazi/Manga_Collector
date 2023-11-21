import { selector } from "./utils.js";

const createPDF = (findChapterWeb, manga_name, chapterToBeCollect) => {
  alert(
    "Site may freeze while downloading as PDF, do not close or reload when processing"
  );
  const filename =
    manga_name +
    `-Chapter(${chapterToBeCollect[0]}${
      chapterToBeCollect[1] ? `-${chapterToBeCollect[1]}` : ""
    })` +
    ".pdf";

  // Default export is a4 paper, portrait, using millimeters for units
  // Don't forget, that there are CORS-Restrictions. So if you want to run it without a Server in your Browser you need to transform the image to a dataURL
  var promises = [];
  var progress = 0;
  if (findChapterWeb.length > 0) {
    var overAllProgess = 0;
    findChapterWeb.forEach((data) => {
      if (data.images && data.images.length > 0) {
        overAllProgess += data.images.length;
      }
    });
    findChapterWeb.forEach((data) => {
      if (data.images.length > 0) {
        var { images } = data;
        images.forEach((imgSrc, idx) => {
          promises.push(
            new Promise((resolve, reject) => {
              var img = new Image();
              img.setAttribute("crossOrigin", "anonymous");
              img.onload = () => {
                var operation = () => {
                  //   Calculating & insering progess in DOM
                  progress++;
                  var progressInPercentage = parseInt(
                    (progress / overAllProgess) * 100
                  );
                  //   console.log(progressInPercentage + "%");
                  if (
                    progressInPercentage >= 0 &&
                    progressInPercentage <= 100
                  ) {
                    selector(".chapter-prgress-percentage").textContent =
                      progressInPercentage + "%";
                  }

                  if (typeof img != "object") {
                    images[idx] = "";
                    return;
                  }

                  const canvas = document.createElement("canvas");
                  canvas.setAttribute("style", "border: 2px solid #ffbb00;");
                  const ctx = canvas.getContext("2d");
                  canvas.width = img.naturalWidth;
                  canvas.height = img.naturalHeight;
                  ctx.drawImage(img, 0, 0);
                  const dataUrl = canvas.toDataURL();
                  images[idx] = dataUrl;
                };
                return resolve(operation());
              };

              img.src = imgSrc;
            })
          );
        });
      }
    });
  }
  //   console.log(promises);
  try {
    Promise.all(promises)
      .then(() => {
        // console.log(findChapterWeb);
        selector(".chapter-prgress-percentage").textContent = "";
        const { jsPDF } = window.jspdf;
        var pdf = new jsPDF({
          orientation: "p",
          unit: "in",
          format: "a4",
        });

        pdf.setFontSize(36);
        pdf.text(manga_name.replaceAll("-", "\n"), 3 + 1 / 2, 1 / 2);
        var pageNumber = 1;
        if (findChapterWeb.length > 0) {
          findChapterWeb.forEach((data, chapIndex) => {
            if (data.chapter && data.images.length > 0) {
              var { chapter, images } = data;
              pdf.setFontSize(28);
              var chapterName = "Chapter " + chapter;
              pdf.text(chapterName, 3 + 1 / 2, 5 + 1 / 2);
              var node = pdf.outline.add(null, chapterName, { pageNumber });
              //   console.log(node);
              images.forEach((image, idx) => {
                var name = "Page " + (idx + 1);
                pdf.addPage();
                pageNumber++;
                pdf.setFontSize(18);
                pdf.text(name, 1 / 2, 1 / 2);
                // console.log(image);
                if (image != "") {
                  //   console.log(image);
                  try {
                    var x, y, width, height;
                    x = 1 / 2;
                    y = 1;
                    width = 7;
                    height = 10;
                    pdf.addImage(image, "PNG", x, y, width, height, "", "FAST");
                  } catch (error) {
                    console.log("Found Missing Part/Error");
                  }
                } else {
                  pdf.text("Not-Found", 3 + 1 / 2, 5 + 1 / 2);
                }

                var outline = pdf.outline.add(node, name, { pageNumber });
                // console.log(outline);
              });
              if (findChapterWeb.length > chapIndex + 1) {
                pdf.addPage();
              }
              pageNumber++;
            }
          });
        }
        pdf.save(filename);
      })
      .finally(() => {
        !selector(".chapter-loading").classList.contains("is-hidden") &&
          selector(".chapter-loading").classList.add("is-hidden");
        // selector(".download-as-pdf").classList.contains("is-hidden") &&
        //   selector(".download-as-pdf").classList.remove("is-hidden");
      });
  } catch (error) {
    alert("There has been a problem, try again later!");
  }
};

export default createPDF;
