import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { json, folder, filename } = body;
    const filePath = path.join(process.cwd(), 'public', 'json', `${folder}`, `${filename}.json}`);

    fs.writeFileSync(filePath, JSON.stringify(json));

    return NextResponse.json({ message: 'Data added successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error adding data' }, { status: 500 });
  }
}
