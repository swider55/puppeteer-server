import { Page } from "puppeteer";
import fs from "fs";
import path from "path";

export async function generatePdf(page: Page, pdfName: string): Promise<void> {
  const pdfDirectory = process.env.PDF_DIRECTORY || "./pdf/";
  const pdfPath = path.join(pdfDirectory, `${pdfName}.pdf`);

  if (!fs.existsSync(pdfDirectory)) {
    fs.mkdirSync(pdfDirectory, { recursive: true });
  }

  await page.pdf({ path: pdfPath });
}

export function deletePdf(pdfName: string): void {
  const pdfDirectory = process.env.PDF_DIRECTORY || ".pdfName/pdf/";
  const pdfPath = path.join(pdfDirectory, `${pdfName}.pdf`);
  if (fs.existsSync(pdfPath)) {
    fs.unlinkSync(pdfPath);
    console.log(`Deleted PDF: ${pdfPath}`);
  } else {
    console.log(`PDF not found: ${pdfPath}`);
  }
}
