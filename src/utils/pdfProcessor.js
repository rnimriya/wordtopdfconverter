import { PDFDocument, degrees } from 'pdf-lib';
import { encryptPDF } from '@pdfsmaller/pdf-encrypt-lite';
import JSZip from 'jszip';

/**
 * Merge multiple PDF documents client-side.
 * @param {File[]} files - Selected PDF files.
 * @param {Function} onProgress - Progress reporting callback.
 * @returns {Promise<Blob>} - Merged PDF Blob.
 */
export async function mergePDFs(files, onProgress) {
  if (!files || files.length === 0) throw new Error("No files selected for merging.");
  
  const mergedDoc = await PDFDocument.create();
  let processedFilesCount = 0;

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const docToMerge = await PDFDocument.load(arrayBuffer);
    
    // Copy all pages
    const pagesToCopy = docToMerge.getPages();
    const copiedPages = await mergedDoc.copyPages(
      docToMerge, 
      pagesToCopy.map((_, index) => index)
    );
    
    // Add pages to merged document
    copiedPages.forEach((page) => mergedDoc.addPage(page));
    
    processedFilesCount++;
    if (onProgress) {
      onProgress(Math.round((processedFilesCount / files.length) * 100));
    }
  }

  const mergedPdfBytes = await mergedDoc.save();
  return new Blob([mergedPdfBytes], { type: 'application/pdf' });
}

/**
 * Rotate pages of a PDF document client-side.
 * @param {File} file - Selected PDF file.
 * @param {Object} rotationMap - Keys are 0-indexed page indices, values are degrees to rotate (90, 180, 270).
 * @param {Function} onProgress - Progress reporting callback.
 * @returns {Promise<Blob>} - Rotated PDF Blob.
 */
export async function rotatePDF(file, rotationMap, onProgress) {
  if (!file) throw new Error("No file selected.");
  
  const arrayBuffer = await file.arrayBuffer();
  if (onProgress) onProgress(30);

  const pdfDoc = await PDFDocument.load(arrayBuffer);
  if (onProgress) onProgress(60);

  const pages = pdfDoc.getPages();

  // Apply rotations
  Object.entries(rotationMap).forEach(([indexStr, deg]) => {
    const pageIndex = parseInt(indexStr);
    if (pageIndex >= 0 && pageIndex < pages.length) {
      const page = pages[pageIndex];
      const currentRotation = page.getRotation().angle;
      const targetRotation = (currentRotation + deg) % 360;
      page.setRotation(degrees(targetRotation));
    }
  });
  if (onProgress) onProgress(80);

  const pdfBytes = await pdfDoc.save();
  if (onProgress) onProgress(100);

  return new Blob([pdfBytes], { type: 'application/pdf' });
}

/**
 * Encrypt and password protect a PDF document client-side.
 * @param {File} file - Selected PDF file.
 * @param {string} userPassword - Password needed to open PDF.
 * @param {string} ownerPassword - Password needed to modify PDF permissions.
 * @param {Function} onProgress - Progress reporting callback.
 * @returns {Promise<Blob>} - Protected PDF Blob.
 */
export async function protectPDF(file, userPassword, ownerPassword ="", onProgress) {
  if (!file) throw new Error("No file selected.");
  if (!userPassword) throw new Error("User password is required.");

  const arrayBuffer = await file.arrayBuffer();
  if (onProgress) onProgress(40);

  // encryptPDF takes Uint8Array or ArrayBuffer and applies password encryption
  const encryptedBytes = await encryptPDF(
    new Uint8Array(arrayBuffer), 
    userPassword, 
    ownerPassword || userPassword
  );
  if (onProgress) onProgress(90);

  const protectedBlob = new Blob([encryptedBytes], { type: 'application/pdf' });
  if (onProgress) onProgress(100);

  return protectedBlob;
}

/**
 * Compress a PDF document client-side.
 * @param {File} file - Selected PDF file.
 * @param {Object} settings - Compression parameters (e.g. removeMetadata).
 * @param {Function} onProgress - Progress reporting callback.
 * @returns {Promise<Blob>} - Compressed PDF Blob.
 */
export async function compressPDF(file, settings, onProgress) {
  if (!file) throw new Error("No file selected.");

  const arrayBuffer = await file.arrayBuffer();
  if (onProgress) onProgress(30);

  const pdfDoc = await PDFDocument.load(arrayBuffer);
  if (onProgress) onProgress(60);

  // Scrub standard metadata fields
  if (settings.removeMetadata) {
    pdfDoc.setTitle('');
    pdfDoc.setAuthor('');
    pdfDoc.setSubject('');
    pdfDoc.setKeywords([]);
    pdfDoc.setCreator('');
    pdfDoc.setProducer('');
  }
  if (onProgress) onProgress(80);

  // save with object streams enabled (which squeezes PDF size structural tables)
  const compressedBytes = await pdfDoc.save({
    useObjectStreams: true,
  });
  if (onProgress) onProgress(100);

  return new Blob([compressedBytes], { type: 'application/pdf' });
}

/**
 * Split a PDF document client-side based on ranges.
 * @param {File} file - Selected PDF file.
 * @param {string} ranges - e.g. "1-3,5" or empty for all pages as single PDFs.
 * @param {Function} onProgress - Progress reporting callback.
 * @returns {Promise<Blob>} - ZIP Blob containing split PDFs or single PDF Blob.
 */
export async function splitPDF(file, ranges, onProgress) {
  if (!file) throw new Error("No file selected.");

  const arrayBuffer = await file.arrayBuffer();
  if (onProgress) onProgress(20);

  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const totalPages = pdfDoc.getPageCount();
  if (onProgress) onProgress(40);

  // Parse ranges (e.g. "1-3, 5")
  const chunks = [];
  if (!ranges || ranges.trim() === '') {
    // Default: extract all pages as individual PDFs
    for (let i = 1; i <= totalPages; i++) {
      chunks.push([i, i]);
    }
  } else {
    const parts = ranges.split(',').map(r => r.trim());
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        if (start && end && start <= end && start <= totalPages) {
          chunks.push([Math.max(1, start), Math.min(totalPages, end)]);
        }
      } else {
        const num = Number(part);
        if (num && num <= totalPages) {
          chunks.push([num, num]);
        }
      }
    }
  }
  
  if (chunks.length === 0) {
    throw new Error("Invalid range format. Please use format like '1-3, 5'.");
  }

  if (onProgress) onProgress(60);

  const zip = new JSZip();
  let generatedDocs = 0;

  for (let i = 0; i < chunks.length; i++) {
    const [start, end] = chunks[i];
    const newDoc = await PDFDocument.create();
    
    const indices = [];
    for(let p = start; p <= end; p++) {
      indices.push(p - 1);
    }
    const copiedPages = await newDoc.copyPages(pdfDoc, indices);
    copiedPages.forEach((page) => newDoc.addPage(page));
    
    const pdfBytes = await newDoc.save();
    
    if (chunks.length === 1) {
      if (onProgress) onProgress(100);
      return new Blob([pdfBytes], { type: 'application/pdf' });
    }
    
    zip.file(`${file.name.replace(/\.[^/.]+$/, '')}_${start}-${end}.pdf`, pdfBytes);
    generatedDocs++;
    if (onProgress) onProgress(60 + (generatedDocs / chunks.length) * 30);
  }

  if (onProgress) onProgress(90);
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  if (onProgress) onProgress(100);

  return zipBlob;
}
