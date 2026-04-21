import { NextResponse } from 'next/server';
import { getExcelData, writeExcelData, generateNewId } from '@/lib/excel';

export async function GET(request: Request, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const sheetName = type === 'den' ? 'VanBan_Den' : type === 'di' ? 'VanBan_Di' : null;

  if (!sheetName) return NextResponse.json({ error: 'Invalid type' }, { status: 400 });

  const data = getExcelData(sheetName);
  return NextResponse.json(data);
}

export async function POST(request: Request, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const sheetName = type === 'den' ? 'VanBan_Den' : type === 'di' ? 'VanBan_Di' : null;

  if (!sheetName) return NextResponse.json({ error: 'Invalid type' }, { status: 400 });

  const body = await request.json();
  const data = getExcelData(sheetName);

  // Determine ID field and prefix
  const idField = type === 'den' ? 'ID_Den' : 'ID_Di';
  // Check typical prefix from data, or fallback
  const existingIds = data.map(item => item[idField]).filter(Boolean);
  let prefix = '';
  if (existingIds.length > 0 && typeof existingIds[0] === 'string') {
    const match = existingIds[0].match(/^[a-zA-Z]+/);
    if (match) prefix = match[0];
  } else {
    prefix = type === 'den' ? 'D' : 'DI'; // e.g. D001 or DI001
  }

  const newId = generateNewId(data, idField, prefix);
  const newItem = { [idField]: newId, ...body };

  data.push(newItem);
  const success = writeExcelData(sheetName, data);

  if (success) {
    return NextResponse.json(newItem);
  } else {
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const sheetName = type === 'den' ? 'VanBan_Den' : type === 'di' ? 'VanBan_Di' : null;

  if (!sheetName) return NextResponse.json({ error: 'Invalid type' }, { status: 400 });

  const body = await request.json();
  const data = getExcelData(sheetName);
  const idField = type === 'den' ? 'ID_Den' : 'ID_Di';
  
  const id = body[idField];
  if (!id) return NextResponse.json({ error: 'ID is required to update' }, { status: 400 });

  const index = data.findIndex(item => item[idField] == id);
  if (index === -1) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

  data[index] = { ...data[index], ...body };
  const success = writeExcelData(sheetName, data);

  if (success) {
    return NextResponse.json(data[index]);
  } else {
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const sheetName = type === 'den' ? 'VanBan_Den' : type === 'di' ? 'VanBan_Di' : null;

  if (!sheetName) return NextResponse.json({ error: 'Invalid type' }, { status: 400 });

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: 'ID is required to delete' }, { status: 400 });

  const idField = type === 'den' ? 'ID_Den' : 'ID_Di';
  const data = getExcelData(sheetName);
  const newData = data.filter(item => item[idField] != id);

  if (newData.length === data.length) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }

  const success = writeExcelData(sheetName, newData);

  if (success) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ error: 'Failed to delete data' }, { status: 500 });
  }
}
