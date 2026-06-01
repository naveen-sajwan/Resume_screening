import { skillsDB } from "../utils/skillsDB.js";

export const calculateScore = (
  resumeText,
  jobDescription
) => {
  const resumeWords = resumeText.toLowerCase().split(/\W+/);

  const extractedSkills = skillsDB.filter((skill) =>
    resumeWords.includes(skill.toLowerCase())
  );

  console.log(extractedSkills)

  const jdSkills = skillsDB.filter((skill) =>
    jobDescription
      .toLowerCase()
      .includes(skill.toLowerCase())
  );

  const matchedSkills = extractedSkills.filter(
    (skill) => jdSkills.includes(skill)
  );

  const missingSkills = jdSkills.filter(
    (skill) => !extractedSkills.includes(skill)
  );
  
  // Calculate experience

  // const TotalExperience = resumeText.match(/(\d+)\+?\s*(years?|yrs?)\s*(of)?\s*experience/i);
  // const experience = TotalExperience ? parseInt(TotalExperience[1]) : 0;
  // console.log(experience);

  const dateRegex = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s*-\s*(Present|(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4})/gi;
  const matches = resumeText.match(dateRegex);
  console.log(matches);
  const score =
    jdSkills.length === 0
      ? 0
      : Math.round(
          (matchedSkills.length / jdSkills.length) *
            100
        );

  return {
    score,
    matchedSkills,
    missingSkills,
    matches,
  };
};