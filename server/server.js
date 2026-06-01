import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";

import resumeRoutes from "./routes/resumeRoutes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

connectDB();

app.use("/api/resumes", resumeRoutes);

const clientBuildPath = path.join(
  __dirname,
  "../client/dist"
);

app.use(express.static(clientBuildPath));

app.get(/.*/, (req, res) => {
  res.sendFile(
    path.join(clientBuildPath, "index.html")
  );
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});