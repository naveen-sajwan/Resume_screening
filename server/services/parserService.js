import fs from "fs";
import * as PdfParse from "pdf-parse-new"; 
import mammoth from "mammoth";

export const extractTextFromFile = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);

    if (filePath.endsWith(".pdf")) {
      const parser = new PdfParse.SmartPDFParser({ enableFastPath: true });
      const result = await parser.parse(dataBuffer);

      console.log("Total Pages:", result.numpages || 0);
      console.log("Metadata:", result.info);

      if (!result.text || result.text.trim().length === 0) {
        console.warn(`⚠️ Warning: No text found in ${filePath}. This might be a scanned PDF image.`);
        return "";
      }

      return result.text;
    }

    if (filePath.endsWith(".docx")) {
      const result = await mammoth.extractRawText({
        buffer: dataBuffer, 
      });
      
      console.log("Mammoth extraction result:", result);
      return result.value || "";
    }

    return "";
  } catch (error) {
    console.error(`❌ Resume Parsing Error for file [${filePath}]:`, error);
    return "";
  }
};
