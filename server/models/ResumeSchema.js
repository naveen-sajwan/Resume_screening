import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    candidateName: String,
    email: String,
    phone: String,
    skills: [String],
    experience: String,
    education:{
      type: [String],
      default: [],
    },
    resumeUrl: String,
    cloudinaryId: String,
    extractedText: String,
    matchScore: Number,
    matchedSkills: [String],
    missingSkills: [String],
    rank: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Resume", ResumeSchema);