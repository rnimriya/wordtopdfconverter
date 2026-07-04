
const fs = require('fs/promises');
const path = require('path');
const ILovePDFApi = require('@ilovepdf/ilovepdf-nodejs');
const ILovePDFFile = require('@ilovepdf/ilovepdf-nodejs/ILovePDFFile');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function run() {
  const instance = new ILovePDFApi(process.env.ILOVEPDF_PROJECT_KEY, process.env.ILOVEPDF_SECRET_KEY);
  
  try {
    const task = instance.newTask('officepdf');
    await task.start();

    // Find the test file in the directory
    const tempPath = path.join(process.cwd(), 'test.docx');
    
    // Check if test.docx exists
    try {
      await fs.access(tempPath);
    } catch {
      console.log('test.docx not found, please create one or modify script');
      return;
    }

    const file = new ILovePDFFile(tempPath);
    await task.addFile(file);
    
    await task.process();
    console.log('Success!');
  } catch (err) {
    console.error('Error:', err.message);
    if (err.response && err.response.data) {
      console.error(JSON.stringify(err.response.data, null, 2));
    }
  }
}
run();

