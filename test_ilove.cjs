
const ILovePDFApi = require('@ilovepdf/ilovepdf-nodejs');
const ILovePDFFile = require('@ilovepdf/ilovepdf-nodejs/ILovePDFFile');
const path = require('path');

async function run() {
  const instance = new ILovePDFApi('project_public_66d403538d974253c4b67ba63e2c04ad_vExfq24612b730319566d8e93efa1085a8f3c', 'secret_key_cea62d355b43c6a529349b599af5c66e_OpEdy6f0a200b260b53b109b08aa8fcca4c5f');
  try {
    const task = instance.newTask('officepdf');
    await task.start();
    const file = new ILovePDFFile(path.join(__dirname, 'package.json')); 
    await task.addFile(file);
    await task.process();
    console.log('Success!');
  } catch (err) {
    if (err.response && err.response.data) {
      console.log(JSON.stringify(err.response.data, null, 2));
    } else {
      console.log(err.message);
    }
  }
}
run();

