import fs from "fs";
import cloudinary from "../config/cloudinary.js";
import Resume from "../models/ResumeSchema.js";

import { extractTextFromFile } from "../services/parserService.js";

import { calculateScore } from "../services/scoringService.js";

import { generateCSV } from "../utils/exportCsv.js";

export const uploadResumes = async (req, res) => {
  try {
    const jdText = req.body.jobDescription;

    const uploadedCandidates = [];

    for (const file of req.files) {
      // Upload to Cloudinary
      const cloudinaryResult =
        await cloudinary.uploader.upload(file.path, {
          resource_type: "raw",
          folder: "resumes",
        });

      // Extract Text
      const extractedText = await extractTextFromFile(file.path);

      //Extract Email
      const emailMatch = extractedText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}/);
      const email = emailMatch ? emailMatch[0] : null;
      console.log(email)

      // Extract Name
      let username = email.split("@")[0];
      let realUser = username.replace(/[0-9]/g, "").replace(/[._-]/g, " ").trim();
      const FullUser = realUser.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
      console.log(FullUser);

      // Extract Phone_no
      const phone = extractedText.match(/(\+91[\s-]?)?[6-9]\d{9}/)?.[0] || "";

      //Calculate Score 
      const scoreData = calculateScore(
        extractedText,
        jdText
      );
      console.log(Resume.schema.path("experience").instance);
      // Save Candidate
      const resume = await Resume.create({
        candidateName: realUser,
        email,
        phone,
        resumeUrl: cloudinaryResult.secure_url,
        cloudinaryId: cloudinaryResult.public_id,
        extractedText,
        matchScore: scoreData.score,
        matchedSkills: scoreData.matchedSkills,
        missingSkills: scoreData.missingSkills,
        experience: scoreData.matches?.join(", ") || "",
      });

      uploadedCandidates.push(resume);

      // Delete local file
      try {
        await fs.promises.unlink(file.path);
        console.log(`Deleted local file: ${file.path}`);
      } catch (error) {
        console.error("Failed to delete file:", error);
      }
    }

    // Ranking
    uploadedCandidates.sort(
      (a, b) => b.matchScore - a.matchScore
    );

    for (let i = 0; i < uploadedCandidates.length; i++) {
      uploadedCandidates[i].rank = i + 1;
      await uploadedCandidates[i].save();
    }

    res.status(200).json(uploadedCandidates);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getRankedCandidates = async (
  req,
  res
) => {
  try {
    const candidates = await Resume.find().sort({
      matchScore: -1,
    });

    res.json(candidates);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const exportCandidatesCSV = async (
  req,
  res
) => {
  try {
    const candidates = await Resume.find();

    const csv = generateCSV(candidates);

    res.header(
      "Content-Type",
      "text/csv"
    );

    res.attachment("candidates.csv");

    return res.send(csv);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};