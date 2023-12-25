import express from "express";
import cors from "cors";
import songRouter from "./routes/songs.mjs";
import authRouter from "./routes/auth.mjs";
import mongoconnect from './db.mjs';
import { fileURLToPath } from "url";
import path from "path";
mongoconnect();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const server = express();
server.use(cors());
server.use(express.json());
server.use(express.static(path.join(__dirname, "build")));
server.use("/auth", authRouter);
server.use("/songs", songRouter);
server.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});




server.listen(8080, () => console.log('Server running on port http://localhost:8080'));