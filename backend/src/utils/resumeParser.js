const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Extracts raw textual content from uploaded PDF or DOCX file
 * @param {string} filePath - Absolute path to uploaded file on disk
 * @param {string} fileType - 'pdf' | 'docx'
 * @returns {Promise<string>} Cleaned extracted text
 */
const extractResumeText = async (filePath, fileType) => {
  try {
    let rawText = '';

    if (fileType === 'pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      rawText = pdfData.text || '';
    } else if (fileType === 'docx') {
      const result = await mammoth.extractRawText({ path: filePath });
      rawText = result.value || '';
    } else {
      throw new Error(`Unsupported file type: ${fileType}. Only PDF and DOCX files are allowed.`);
    }

    // Clean and normalize extracted text
    const cleanedText = rawText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // remove control characters
      .replace(/\n{3,}/g, '\n\n') // collapse multiple blank lines
      .trim();

    return cleanedText;
  } catch (error) {
    console.error(`[ResumeParser] Extraction error for ${filePath}:`, error.message);
    throw new Error(`Failed to extract text from resume: ${error.message}`);
  }
};

module.exports = { extractResumeText };
