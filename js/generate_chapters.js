export default async (url, manga_name) => {
  try {
    return await fetch(url, {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "en-US,en;q=0.9,la;q=0.8",
        "sec-ch-ua":
          '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
      },
      referrer: "https://mangasee123.com/",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
      mode: "cors",
      credentials: "include",
    })
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

        var curChapter = /vm\.(CurChapter)\s*=\s*([^\n;]+)[;\n]/g.exec(
          html
        )?.[2]
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
            error: false,
            chapter: chapterImage(curChapter.Chapter),
            images,
          };
        }
      })
      .catch(function (err) {
        // There was an error
        console.log("error occured!", err);
        return { error: true, err };
        // throw { error: true, msg: "Internal Error!" };
      })
      .finally(() => null);
  } catch (error) {
    console.log("Error Collecting Chapter", error);
    return new Promise((resolve, reject) =>
      resolve({
        error: true,
        msg: "Internal Error!",
      })
    );
  }
};
