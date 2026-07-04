import fs from 'fs';
import { NextResponse } from 'next/server';

const buffer = Buffer.from("Hello world, this is a test.", "utf-8");
const uint8 = new Uint8Array(buffer);

try {
  const response = new NextResponse(uint8, { status: 200 });
  response.arrayBuffer().then(ab => {
      console.log("ArrayBuffer length:", ab.byteLength);
      const str = Buffer.from(ab).toString('utf-8');
      console.log("Extracted string:", str.substring(0, 50));
  });
} catch (e) {
  console.log("Error:", e.message);
}
