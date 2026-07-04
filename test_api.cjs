const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const pKeyMatch = env.match(/ILOVEPDF_PROJECT_KEY="(.+?)"/);
const sKeyMatch = env.match(/ILOVEPDF_SECRET_KEY="(.+?)"/);
if (!pKeyMatch || !sKeyMatch) throw new Error('Keys not found');
const ILovePDFApi = require('@ilovepdf/ilovepdf-nodejs');
const ILovePDFFile = require('@ilovepdf/ilovepdf-nodejs/ILovePDFFile');
const api = new ILovePDFApi(pKeyMatch[1], sKeyMatch[1]);
const task = api.newTask('officepdf');

async function run() {
  await task.start();
  const file = new ILovePDFFile('test.docx');
  await task.addFile(file);
  await task.process();
  const data = await task.download();
  console.log('Success, data length:', data.length);
}
run().catch(console.error);
