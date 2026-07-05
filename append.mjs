import fs from 'fs';

const content = `
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
`;

fs.appendFileSync('src/utils/excelParser.js', content, 'utf8');
