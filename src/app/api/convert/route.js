import { NextResponse } from 'next/server';
import ILovePDFApi from '@ilovepdf/ilovepdf-nodejs';
import ILovePDFFile from '@ilovepdf/ilovepdf-nodejs/ILovePDFFile';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import crypto from 'crypto';

export async function POST(req) {
  let inputFilePaths = [];
  let outputDir = null;

  try {
    // 1. Get form data
    const formData = await req.formData();
    const files = formData.getAll('file');
    const taskType = formData.get('task') || 'officepdf'; // e.g., 'officepdf' for Word to PDF

    const params = {};
    for (const [key, value] of formData.entries()) {
      if (key !== 'file' && key !== 'task') {
        params[key] = value;
      }
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    if (!process.env.ILOVEPDF_PROJECT_KEY || !process.env.ILOVEPDF_SECRET_KEY) {
      return NextResponse.json({ error: 'ILOVEPDF API keys are not configured in the backend' }, { status: 500 });
    }

    // 2. Initialize API
    const instance = new ILovePDFApi(process.env.ILOVEPDF_PROJECT_KEY, process.env.ILOVEPDF_SECRET_KEY);

    // 3. Save uploaded files to temp directory
    const tempId = crypto.randomUUID();
    const tempDir = os.tmpdir();
    outputDir = path.join(tempDir, `output-${tempId}`);
    await fs.mkdir(outputDir, { recursive: true });

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const inputFilePath = path.join(tempDir, `${tempId}-${crypto.randomUUID()}-${safeName}`);
      await fs.writeFile(inputFilePath, buffer);
      inputFilePaths.push(inputFilePath);
    }

    // 4. Create and start ILovePDF Task
    if (taskType === 'unsupported') {
      return NextResponse.json({ error: 'This specific tool is currently undergoing maintenance for API integration and is not supported in the current version.' }, { status: 501 });
    }

    const task = instance.newTask(taskType);
    await task.start();

    // 5. Add Files
    for (const inputFilePath of inputFilePaths) {
      const iLovePdfFile = new ILovePDFFile(inputFilePath);
      iLovePdfFile.filename = path.basename(inputFilePath); // Fix SDK bug on Windows where it uses lastIndexOf('/')
      try {
        await task.addFile(iLovePdfFile);
      } catch (apiErr) {
        console.error('ILovePDF AddFile Error:', apiErr.response?.data || apiErr.message);
        return NextResponse.json({ 
          error: `API Upload Error: ${apiErr.response?.data?.error?.message || apiErr.response?.data?.message || apiErr.message}` 
        }, { status: 400 });
      }
    }

    // 6. Process the task
    try {
      await task.process(params);
    } catch (apiErr) {
      console.error('ILovePDF Process Error:', apiErr.response?.data || apiErr.message);
      return NextResponse.json({ 
        error: `API Error: ${apiErr.response?.data?.error?.message || apiErr.message}` 
      }, { status: 400 });
    }

    // 7. Download output
    let outputBuffer;
    try {
      outputBuffer = await task.download();
    } catch (apiErr) {
      console.error('ILovePDF Download Error:', apiErr.response?.data || apiErr.message);
      return NextResponse.json({ 
        error: `API Error: ${apiErr.response?.data?.error?.message || apiErr.message}` 
      }, { status: 400 });
    }

    // Cleanup
    for (const p of inputFilePaths) await fs.unlink(p).catch(console.error);
    await fs.rm(outputDir, { recursive: true, force: true }).catch(console.error);

    // 8. Determine Content-Type based on task type or just send as PDF/ZIP
    // ILovePDF returns a ZIP if multiple files are processed independently, but for merge it returns a single PDF.
    // If we just check the signature of the buffer, we can know if it's a ZIP or PDF.
    // PDF starts with %PDF (25 50 44 46)
    // ZIP starts with PK (50 4B 03 04)
    let contentType = 'application/pdf';
    let ext = 'pdf';
    
    if (outputBuffer.length >= 4) {
      // ZIP (PK..)
      if (outputBuffer[0] === 0x50 && outputBuffer[1] === 0x4B) {
        contentType = 'application/zip';
        ext = 'zip';
      } 
      // JPG (FF D8 FF)
      else if (outputBuffer[0] === 0xFF && outputBuffer[1] === 0xD8 && outputBuffer[2] === 0xFF) {
        contentType = 'image/jpeg';
        ext = 'jpg';
      }
      // PNG (89 50 4E 47)
      else if (outputBuffer[0] === 0x89 && outputBuffer[1] === 0x50 && outputBuffer[2] === 0x4E && outputBuffer[3] === 0x47) {
        contentType = 'image/png';
        ext = 'png';
      }
    }

    // 9. Send file stream back to client
    return new NextResponse(outputBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="processed-document.${ext}"`
      }
    });

  } catch (err) {
    console.error("Conversion Error:", err);
    console.error('ILovePDF API Error Details:', JSON.stringify(err, null, 2));
    
    // Try to cleanup on error
    for (const p of inputFilePaths) await fs.unlink(p).catch(() => {});
    if (outputDir) await fs.rm(outputDir, { recursive: true, force: true }).catch(() => {});
    
    let friendlyMessage = 'Error converting file. Please try again.';
    
    // Check if the ILovePDF API specifically reported a damaged file
    if (err?.message?.includes('DamagedFile') || 
        err?.param?.[0]?.error === 'DamagedFile' ||
        err?.error?.param?.[0]?.error === 'DamagedFile') {
      friendlyMessage = 'The uploaded file appears to be corrupted, empty, or not a valid document format. Please test with a real, valid document.';
    } else if (err.message) {
      friendlyMessage = err.message;
    }

    return NextResponse.json({ 
      error: friendlyMessage,
      details: err
    }, { status: 500 });
  }
}
