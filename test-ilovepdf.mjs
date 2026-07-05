import ILovePDFApi from '@ilovepdf/ilovepdf-nodejs';
import fs from 'fs';
import path from 'path';

async function testILovePdf() {
    console.log("Starting ILovePDF test...");
    try {
        const instance = new ILovePDFApi(
            "project_public_66d403538d974253c4b67ba63e2c04ad_vExfq24612b730319566d8e93efa1085a8f3c",
            "secret_key_cea62d355b43c6a529349b599af5c66e_OpEdy6f0a200b260b53b109b08aa8fcca4c5f"
        );
        
        console.log("Instance created.");
        
        const task = instance.newTask('officepdf');
        await task.start();
        console.log("Task started.");
        
        const { default: ILovePDFFile } = await import('@ilovepdf/ilovepdf-nodejs/ILovePDFFile.js');
        
        // We need a dummy word file to add
        fs.writeFileSync("test.docx", "test document");
        console.log("Dummy file created.");
        
        const iLovePdfFile = new ILovePDFFile("test.docx");
        iLovePdfFile.filename = "test.docx"; // Force clean basename
        await task.addFile(iLovePdfFile);
        await task.process();
        console.log("Task processed.");
        
        const result = await task.download();
        console.log("Result length:", result.length);
        
        fs.unlinkSync("test.docx");
        
    } catch (e) {
        console.error("Error:", e);
    }
}

testILovePdf();
