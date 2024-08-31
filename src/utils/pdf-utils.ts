import { Page } from 'puppeteer';
import fs from 'fs';
import path from 'path';

let _lastSavedPdf: string = 'null';

export async function generatePdf(page: Page, pdfName: string): Promise<void> {
    const pdfDirectory = process.env.PDF_DIRECTORY || './pdf/';
    const pdfPath = path.join(pdfDirectory, `${pdfName}.pdf`);

    await page.pdf({ path: pdfPath });
    _lastSavedPdf = pdfPath;
}

export function deletePdf(pdfPath: string): void {
    if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
        console.log(`Deleted PDF: ${pdfPath}`);
    } else {
        console.log(`PDF not found: ${pdfPath}`);
    }
}

export function deleteLastPdf(): void {
    if (_lastSavedPdf) { deletePdf(_lastSavedPdf)}
}

export function getLastSavedPdf(): string {
    return _lastSavedPdf;
}

export function updateLastPdf(pdfPath: string): void {
    _lastSavedPdf = pdfPath;
}
