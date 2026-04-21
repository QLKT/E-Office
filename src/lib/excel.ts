import * as xlsx from 'xlsx';
import fs from 'fs';

// Using the absolute path provided by the user
const EXCEL_PATH = 'C:\\Users\\ULTRA 9\\Desktop\\webbapp\\WebVanthu.xlsx';

export function getExcelData(sheetName: string): Record<string, unknown>[] {
  try {
    const fileBuffer = fs.readFileSync(EXCEL_PATH);
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) return [];
    
    // Read starting from header row
    const rawData = xlsx.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '', raw: false, dateNF: 'dd/mm/yyyy' });
    return rawData;
  } catch (error) {
    console.error('Error reading excel for sheet', sheetName, error);
    return [];
  }
}

export function writeExcelData(sheetName: string, data: Record<string, unknown>[]) {
  try {
    const fileBuffer = fs.readFileSync(EXCEL_PATH);
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    
    const newSheet = xlsx.utils.json_to_sheet(data);
    workbook.Sheets[sheetName] = newSheet;
    
    // Write out buffer and save to fs
    const newBuffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    fs.writeFileSync(EXCEL_PATH, newBuffer);
    return true;
  } catch (error) {
    console.error('Error writing excel for sheet', sheetName, error);
    return false;
  }
}

export function generateNewId(data: Record<string, unknown>[], idField: string, prefix: string) {
  let maxNum = 0;
  for (const item of data) {
    const val = item[idField];
    if (val && typeof val === 'string' && val.startsWith(prefix)) {
      const numPart = parseInt(val.replace(prefix, ''), 10);
      if (!isNaN(numPart) && numPart > maxNum) {
        maxNum = numPart;
      }
    } else if (val && typeof val === 'number') {
      if (val > maxNum) maxNum = val;
    }
  }
  const newNum = maxNum + 1;
  if (prefix) {
    return `${prefix}${newNum.toString().padStart(3, '0')}`;
  }
  return newNum;
}
