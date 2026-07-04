import * as docx from 'docx-preview';
import * as pdfjs from 'pdfjs-dist';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

// Configure the pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

/**
 * Render a Word (.docx) file to a DOM element client-side using docx-preview.
 * @param {ArrayBuffer} arrayBuffer - Word file array buffer.
 * @param {HTMLElement} container - The DOM element to render into.
 * @returns {Promise<void>}
 */
export async function renderDocxToElement(arrayBuffer, container) {
  try {
    await docx.renderAsync(arrayBuffer, container, null, {
      className: 'docx', // Default class name for the wrapper
      inWrapper: true, // Render inside a wrapper
      ignoreWidth: false, // Don't ignore page width
      ignoreHeight: false, // Don't ignore page height
      ignoreFonts: false, // Use document fonts
      breakPages: true, // Handle page breaks
      ignoreLastRenderedPageBreak: true,
      experimental: false,
      trimXmlDeclaration: true,
      debug: false,
    });
  } catch (err) {
    console.error("docx-preview error:", err);
    throw new Error("Failed to parse Word document format.");
  }
}

/**
 * Create a downloadable native Word (.docx) file from text pages.
 * @param {string[]} pages - Array of extracted page strings.
 * @returns {Promise<Blob>} - Word document Blob.
 */
export async function createDocxFromPages(pages) {
  const docSections = pages.map((pageText, idx) => {
    const paragraphs = pageText.split('\n')
      .filter(p => p.trim())
      .map(p => new Paragraph({
        children: [new TextRun(p.trim())],
        spacing: { after: 200 }
      }));
    
    return {
      properties: idx > 0 ? { type: 'continuous' } : {}, // Not perfectly isolating pages but valid
      children: [
        new Paragraph({
          text: `Page ${idx + 1}`,
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 400 },
          pageBreakBefore: idx > 0
        }),
        ...paragraphs
      ]
    };
  });

  const doc = new Document({
    sections: docSections
  });

  return Packer.toBlob(doc);
}

/**
 * Extract clean text and structure from a PDF file.
 * @param {File} file - PDF file.
 * @param {Function} onProgress - Progress reporting callback.
 * @returns {Promise<{text: string, pages: string[]}>} - Combined text and list of text pages.
 */
export async function extractTextFromPDF(file, onProgress) {
  if (!file) throw new Error("No file specified.");

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const totalPages = pdf.numPages;

  const pagesText = [];
  
  for (let i = 1; i <= totalPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    
    // Group text items by their vertical coordinates (Y-positions) to respect line breaks
    const textItems = textContent.items;
    
    // Simple line grouping algorithm
    const lines = {};
    textItems.forEach(item => {
      const y = Math.round(item.transform[5]); // Y coordinate
      if (!lines[y]) {
        lines[y] = [];
      }
      lines[y].push(item);
    });

    // Sort Y coordinates descending (top of the page first)
    const sortedY = Object.keys(lines).sort((a, b) => b - a);
    
    // Map lines to final strings, sorting X coordinates ascending (left to right)
    const pageLines = sortedY.map(y => {
      const lineItems = lines[y].sort((a, b) => a.transform[4] - b.transform[4]);
      return lineItems.map(item => item.str).join(' ');
    });

    pagesText.push(pageLines.join('\n'));

    if (onProgress) {
      onProgress(Math.round((i / totalPages) * 100));
    }
  }

  return {
    text: pagesText.join('\n\n--- Page Break ---\n\n'),
    pages: pagesText
  };
}
