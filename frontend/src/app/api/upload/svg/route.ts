import type { NextApiRequest } from 'next';
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

// This is a server route, so we need to use Node's fs module to write the file to the file system. We'll use the path module to get the correct path to the public folder.
export async function POST(request: Request) {

  try {
    const body =await request.json()

    const { svg, filename } = body;
    const filePath = path.join(process.cwd(), 'public', 'svgs', `${filename}.svg`);

    fs.writeFileSync(filePath, svg);

    return NextResponse.json({ message: 'SVG uploaded successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error uploading SVG' }, { status: 500 });
  }
}
