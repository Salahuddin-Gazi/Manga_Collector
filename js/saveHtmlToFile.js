import back_to_top_button from "./back_to_top_button.js";

export default function saveHtmlToFile(htmlContent, fileName, manga_name) {
  var style = `<style>
    .chapter-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .chapter-title {
      padding: 5px 10px;
      border: solid 5px #ffbb00;
      margin: 28px 0;
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
  </style>
  `;
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
      ${htmlContent}
      ${back_to_top_button}
      </div>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
    </body>
  </html>
  `;
  const blob = new Blob([html], { type: "text/html" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
