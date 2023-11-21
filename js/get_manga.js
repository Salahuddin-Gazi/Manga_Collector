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
  fetch(url)
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
      // return { error: true, err };
    })
    .finally(() => {
      return { chapter: "not-found" };
    });
