var chapterURLEncode = function (e) {
  //   console.log(e);
  var Index = "";
  var t = e.substring(0, 1);
  1 != t && (Index = "-index-" + t);
  var n = parseInt(e.slice(1, -1)),
    m = "",
    a = e[e.length - 1];
  return {
    chapter: n,
    chapter_url_part:
      (0 != a && (m = "." + a), "-chapter-" + n + m + Index + ".html"),
  };
};

export default (url) =>
  // fetch(url)
  fetch(url, {
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
    .then((html) => {
      var chapters = /vm\.(Chapters)\s*=\s*([^\n;]+)[;\n]/g.exec(html)?.[2];
      var curChapter = null;
      if (chapters) {
        curChapter = JSON.parse(chapters)?.[0];
      }
      if (curChapter) {
        return chapterURLEncode(curChapter.Chapter);
      }
      return { chapter: "not-found" };
    })
    .catch(function (err) {
      // There was an error
      console.log("error occured!", err);
      throw { chapter: "not-found" };
    })
    .finally(() => {
      return { chapter: "not-found" };
    });
