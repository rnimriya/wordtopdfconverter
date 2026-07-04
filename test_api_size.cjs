
const http = require('http');
async function test() {
  const fs = require('fs');
  const buffer = fs.readFileSync('valid.docx');
  console.log('Original size:', buffer.length);
  
  const FormData = require('form-data');
  const form = new FormData();
  form.append('task', 'officepdf');
  form.append('file', buffer, { filename: 'valid.docx', contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

  form.submit('http://localhost:3000/api/convert', function(err, res) {
    if (err) console.error(err);
    else {
        let body = '';
        res.on('data', chunk => body+=chunk);
        res.on('end', () => console.log('Response:', res.statusCode, body.substring(0, 500)));
    }
  });
}
test();

