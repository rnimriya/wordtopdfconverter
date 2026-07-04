import { createServer } from 'http';
const server = createServer((req, res) => {
  const arr = new Uint8Array([37, 80, 68, 70, 45]); // %PDF-
  res.writeHead(200, {'Content-Type': 'application/pdf'});
  res.end(arr);
});
server.listen(3001, () => {
  fetch('http://localhost:3001')
    .then(r => r.arrayBuffer())
    .then(buf => {
      console.log('Buffer length:', buf.byteLength);
      server.close();
    });
});
