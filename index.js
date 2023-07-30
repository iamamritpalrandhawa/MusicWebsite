import { createRequire } from "module";
const require = createRequire(import.meta.url);
import express from "express";
import { fileURLToPath } from "url"; // Import the fileURLToPath function
import path from "path";
import cors from "cors";
import GetRouter from "./routes/get.mjs"; // Use import for ES modules

const __filename = fileURLToPath(import.meta.url); // Get the current module's filename
const __dirname = path.dirname(__filename); // Get the current module's directory name

const server = express();
server.use(cors());
server.use(express.static(path.join(__dirname, "build")));

server.use("/", GetRouter);
// Handle all other routes and serve the "index.html" file
server.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

server.listen(8080, () => {
  console.log("Server is listening on port http://localhost:8080");
});
