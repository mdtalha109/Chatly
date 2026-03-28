const PDFParser = require("pdf2json");
const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");

const safeDecodeURIComponent = (str) => {
    try {
        return decodeURIComponent(str);
    } catch {
        // Fallback: replace % sequences that can't be decoded
        return str.replace(/%[0-9A-Fa-f]{2}/g, (match) => {
            try {
                return decodeURIComponent(match);
            } catch {
                return ""; // Drop undecodable sequences
            }
        });
    }
};

/**
 * Extract text from PDF file path or URL
 * @param {string} source - Local file path or URL of the PDF file
 * @param {boolean} isLocalFile - Whether source is a local file path (default: true)
 * @returns {Promise<{text: string, numPages: number, metadata: object}>}
 */
async function extractTextFromPdf(source, isLocalFile = true) {
    try {
        let filePath = source;

        if (!isLocalFile) {
            // Download from URL to temp file
            console.log("Downloading PDF from URL:", source);
            const response = await axios.get(source, {
                responseType: "arraybuffer",
            });

            const tempPath = path.join(__dirname, "../uploads", `temp_${Date.now()}.pdf`);
            await fs.writeFile(tempPath, Buffer.from(response.data));
            filePath = tempPath;
        }

        console.log("Extracting text from PDF file:", filePath);

        return new Promise((resolve, reject) => {
            const pdfParser = new PDFParser();

            pdfParser.on("pdfParser_dataError", (errData) => {
                console.error("PDF parsing error in pdfParser_dataError:", errData.parserError);
                reject(new Error(errData.parserError));
            });

            pdfParser.on("pdfParser_dataReady", (pdfData) => {
                console.log("PDF data ready, processing text extraction...", pdfData);
                try {
                    // Extract text from all pages
                    let text = "";
                    const pages = pdfData.Pages;

                    pages.forEach((page) => {
                        page.Texts.forEach((textItem) => {
                            
                            textItem.R.forEach((r) => {
                                text += safeDecodeURIComponent(r.T) + " ";
                            });
                        });
                        text += "\n"; // Add newline between pages
                    });

                    console.log("Extracted text:", text); 

                    const numPages = pages.length;
                    const metadata = pdfData.Meta || {};

                    // Clean up temp file if downloaded
                    if (!isLocalFile) {
                        fs.unlink(filePath).catch(() => { });
                    }

                    console.log("text: ", text)

                    resolve({
                        text: text.trim(),
                        numPages: numPages,
                        metadata: metadata,
                    });
                } catch (error) {
                    reject(new Error(`Failed to parse PDF data: ${error.message}`));
                }
            });

            console.log("Loading PDF file with pdf2json...", filePath);
            pdfParser.loadPDF(filePath);
        });
    } catch (error) {
        throw new Error(`Failed to extract text from PDF: ${error.message}`);
    }
}

/**
 * Split text into overlapping chunks
 * @param {string} text - The text to chunk
 * @param {number} chunkSize - Size of each chunk in characters (default: 1000)
 * @param {number} overlap - Number of overlapping characters between chunks (default: 100)
 * @returns {Array<{chunkText: string, chunkIndex: number}>}
 */


module.exports = {
    extractTextFromPdf,
};
