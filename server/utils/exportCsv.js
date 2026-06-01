import { Parser } from "json2csv";

export const generateCSV = (data) => {
  const fields = [
    "candidateName",
    "email",
    "matchScore",
    "rank",
  ];

  const parser = new Parser({ fields });

  return parser.parse(data);
};