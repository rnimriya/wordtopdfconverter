import * as pdfjs from 'pdfjs-dist';
import * as XLSX from 'xlsx';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export async function createExcelFromPdf(file, onProgress) {
  if (!file) throw new Error("No file specified.");

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const totalPages = pdf.numPages;

  const workbook = XLSX.utils.book_new();

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    
    // Group text items by their vertical coordinates (Y-positions)
    // with a small threshold to catch text on the same line
    const textItems = textContent.items;
    
    const linesMap = new Map();
    const threshold = 5; // pixels
    
    textItems.forEach(item => {
      const y = item.transform[5];
      let matchedY = null;
      for (let existingY of linesMap.keys()) {
        if (Math.abs(existingY - y) < threshold) {
          matchedY = existingY;
          break;
        }
      }
      if (matchedY === null) {
        matchedY = Math.round(y);
        linesMap.set(matchedY, []);
      }
      linesMap.get(matchedY).push(item);
    });

    // Sort lines by Y descending (top to bottom on page)
    const sortedY = Array.from(linesMap.keys()).sort((a, b) => b - a);
    
    const sheetData = [];
    
    sortedY.forEach(y => {
      const lineItems = linesMap.get(y);
      // Sort items on the line by X coordinate (left to right)
      lineItems.sort((a, b) => a.transform[4] - b.transform[4]);
      
      // Attempt to group into columns based on X gaps
      const row = [];
      let currentCell = '';
      let lastX = null;
      
      lineItems.forEach(item => {
        const x = item.transform[4];
        if (lastX !== null && (x - lastX > 20)) { // 20px gap means new column
          if (currentCell.trim()) row.push(currentCell.trim());
          currentCell = item.str;
        } else {
          currentCell += ' ' + item.str;
        }
        lastX = x + item.width;
      });
      if (currentCell.trim()) row.push(currentCell.trim());
      
      if (row.length > 0) sheetData.push(row);
    });
    
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData.length > 0 ? sheetData : [['(No data)']]);
    XLSX.utils.book_append_sheet(workbook, worksheet, `Page ${i}`);
    
    if (onProgress) onProgress(i / totalPages);
  }

  // Generate Excel file buffer
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

/**
 * Parse an Excel (.xlsx/.xls/.csv) file and convert its sheets to HTML tables.
 * @param {ArrayBuffer} arrayBuffer - File data.
 * @returns {Promise<{sheets: {name: string, html: string}[]}>} - Parsed sheets.
 */
export async function convertExcelToHtml(arrayBuffer) {
  try {
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheets = workbook.SheetNames.map(name => {
      const worksheet = workbook.Sheets[name];
      const html = XLSX.utils.sheet_to_html(worksheet, {
        header: '<table>',
        footer: '</table>'
      });
      return { name, html };
    });
    return { sheets };
  } catch (err) {
    console.error('SheetJS parsing error:', err);
    throw new Error('Failed to read Excel workbook format.');
  }
}
