import { PDFDocument, rgb } from 'pdf-lib';

export async function editPdfLocal(file, taskParams) {
  if (!file) throw new Error("No file specified.");

  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  
  const pages = pdfDoc.getPages();
  if (pages.length === 0) throw new Error("PDF has no pages");
  
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();

  // Draw based on task
  if (taskParams.task === 'edit' || taskParams.task === 'annotate' || taskParams.task === 'form') {
    const text = taskParams.text || 'Edited Document';
    firstPage.drawText(text, {
      x: 50,
      y: height - 100,
      size: 24,
      color: rgb(0, 0.53, 0.71),
    });
  } 
  else if (taskParams.task === 'sign') {
    const signature = taskParams.text || 'Digitally Signed';
    firstPage.drawText(signature, {
      x: width - 250,
      y: 50,
      size: 30,
      color: rgb(0, 0, 0.7), // Blue ink
    });
  }
  else if (taskParams.task === 'redact') {
    // Draw a black rectangle to simulate redaction
    firstPage.drawRectangle({
      x: 50,
      y: height - 150,
      width: 400,
      height: 50,
      color: rgb(0, 0, 0),
    });
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}
