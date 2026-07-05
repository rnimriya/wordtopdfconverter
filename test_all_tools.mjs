import fs from 'fs';

async function runTests() {
  const fileUrl = 'sample.pdf';
  if (!fs.existsSync(fileUrl)) {
    console.error("Please ensure sample.pdf exists.");
    return;
  }

  const fileBuffer = fs.readFileSync(fileUrl);
  const fileBlob = new Blob([fileBuffer], { type: 'application/pdf' });

  const tasks = [
    { name: 'compress', formDataFields: { task: 'compress' } },
    { name: 'split', formDataFields: { task: 'split', split_mode: 'ranges', ranges: '1-1' } },
    { name: 'rotate', formDataFields: { task: 'rotate', rotate: 90 } },
    { name: 'protect', formDataFields: { task: 'protect', password: 'test' } },
    { name: 'watermark', formDataFields: { task: 'watermark', mode: 'text', text: 'TEST' } },
    { name: 'pdfjpg', formDataFields: { task: 'pdfjpg' } }
  ];

  for (const task of tasks) {
    console.log(`\nTesting task: ${task.name}...`);
    try {
      const form = new FormData();
      form.append('file', fileBlob, 'sample.pdf');
      for (const [key, value] of Object.entries(task.formDataFields)) {
        form.append(key, value);
      }

      const res = await fetch('http://localhost:3000/api/convert', {
        method: 'POST',
        body: form
      });

      if (res.ok) {
        console.log(`✅ ${task.name} Success. Status: ${res.status}`);
      } else {
        const text = await res.text();
        console.error(`❌ ${task.name} Failed. Status: ${res.status}, Message: ${text}`);
      }
    } catch (e) {
      console.error(`❌ ${task.name} Exception: ${e.message}`);
    }
  }
}

runTests();
