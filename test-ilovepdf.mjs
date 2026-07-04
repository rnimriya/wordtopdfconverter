import ILovePDFApi from '@ilovepdf/ilovepdf-nodejs';
import fs from 'fs';
import path from 'path';

async function testILovePdf() {
    console.log("Starting ILovePDF test...");
    try {
        const instance = new ILovePDFApi(
            "project_public_66d403538d974253c4b67ba63e2c04ad_vExfq24612b730319566d8e93efa1085a8f3c",
            "ysecret_key_cea62d355b43c6a529349b599af5c66e_OpEdy6f0a200b260b53b109b08aa8fcca4c5f"
        );
        
        console.log("Instance created.");
        
        const task = instance.newTask('officepdf');
        await task.start();
        console.log("Task started.");
        
        // We need a dummy word file to add
        fs.writeFileSync("test.docx", "test document");
        console.log("Dummy file created.");
        
        const file = task.addFile("test.docx");
        await task.process();
        console.log("Task processed.");
        
        const result = await task.download();
        console.log("Type of result:", typeof result);
        console.log("Result is Uint8Array?", result instanceof Uint8Array);
        console.log("Result is String?", typeof result === 'string');
        console.log("Result is Buffer?", Buffer.isBuffer(result));
        
        fs.unlinkSync("test.docx");
        
    } catch (e) {
        console.error("Error:", e);
    }
}

testILovePdf();
