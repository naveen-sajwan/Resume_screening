import express from "express";
import upload from "../middlewares/uploadMiddleware.js";

import {
  uploadResumes,
  getRankedCandidates,
  exportCandidatesCSV,
} from "../controllers/resumeController.js";

import {
  deleteAllDocs,
  deleteSingleResume,
} from "../controllers/deleteController.js";

const router = express.Router();


router.post(
  "/upload",
  upload.array("resumes"),
  uploadResumes
);
router.get("/", getRankedCandidates);
router.get("/export/csv", exportCandidatesCSV);

// Delete Routes
router.delete("/deleteAll",deleteAllDocs);
router.delete("/delete-single/:id",deleteSingleResume);

export default router;