import { createRequire } from "module";
const require = createRequire(import.meta.url);
const express = require("express");
const cors = require("cors");
// const Get = require("./routes/get");
import GetRouter from "./routes/get.mjs";
const server = express();
server.use(cors());
server.use(express.static("build"));
// server.get("/", async (req, res) => {
//   const responseHTML = `
//   <html>
//     <body>
//       <p>Thanks for Visiting our API</p>
//       <p>Our paths are:</p>
//       <ol>
//         <li><a href="/id/">/id/<songId></a> for getting Songs</li>
//         <li><a href="/name/">/name/<songname></a> for getting Songs</li>
//         <li><a href="/getalbums/">/getalbums/<albumname></a> for getting playlists</li>
//         <li><a href="/albumid/">/albumid/<albumId></a> for getting playlist Songs</li>
//       </ol>
//     </body>
//   </html>
// `;

//   res.send(responseHTML);
// });
server.use("/", GetRouter);

server.listen(8080, () => {
  console.log("Server is listening on port http://localhost:8080");
});
