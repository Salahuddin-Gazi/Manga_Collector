export default (url, manga_name) =>
  fetch(url)
    .then(function (response) {
      return response.text();
    })
    .then(function (html) {
      //   console.log(html);
      var curPathName = /vm\.(CurPathName)\s*=\s*([^\n;]+)[;\n]/g
        .exec(html)?.[2]
        .trim()
        .replaceAll('"', "")
        .replaceAll("/", "");
      // console.log(curPathName);

      var curChapter = /vm\.(CurChapter)\s*=\s*([^\n;]+)[;\n]/g.exec(html)?.[2]
        ? JSON.parse(/vm\.(CurChapter)\s*=\s*([^\n;]+)[;\n]/g.exec(html)?.[2])
        : null;
      // console.log(curChapter);
      var chapterImage = function (ChapterString) {
        var Chapter = ChapterString.slice(1, -1);
        var Odd = ChapterString[ChapterString.length - 1];
        if (Odd == 0) {
          return Chapter;
        } else {
          return Chapter + "." + Odd;
        }
      };
      var pageImage = function (PageString) {
        var s = "000" + PageString;
        return s.substr(s.length - 3);
      };

      const images = [];
      if (curChapter && curPathName) {
        if (curChapter.Page) {
          const pageNumber = parseInt(curChapter.Page);
          let i = 1;
          while (i <= pageNumber) {
            // console.log(
            //   `https://${curPathName}/manga/${manga_name}/${
            //     curChapter.Directory == "" ? "" : curChapter.Directory + "/"
            //   }${chapterImage(curChapter.Chapter)}-${pageImage(i)}.png`
            // );
            images.push(
              `https://${curPathName}/manga/${manga_name}/${
                curChapter.Directory == "" ? "" : curChapter.Directory + "/"
              }${chapterImage(curChapter.Chapter)}-${pageImage(i)}.png`
            );
            i++;
          }
        }
        // console.log({
        //   chapter: chapterImage(curChapter.Chapter),
        //   images,
        // });
        return {
          chapter: chapterImage(curChapter.Chapter),
          images,
        };
      }
    })
    .catch(function (err) {
      // There was an error
      console.log("error occured!", err);
      // return { error: true, err };
    })
    .finally(() => null);
