
const fs = require('fs');

async function test() {
  try {
    const formData = new FormData();
    // Use an actual valid pdf file to test if upload corrupts it
    const buffer = fs.readFileSync('sample.pdf');
    const blob = new Blob([buffer], { type: 'application/pdf' });
    formData.append('file', blob, 'sample.pdf');
    formData.append('task', 'compress'); // 'compress' works on pdfs

    const response = await fetch('http://localhost:3000/api/convert', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      console.log('Error', response.status);
      console.log(await response.text());
    } else {
      console.log('Success, received blob of size', (await response.blob()).size);
    }
  } catch (e) {
    console.error('Fetch error:', e);
  }
}
test();

