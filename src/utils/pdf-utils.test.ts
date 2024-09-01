import { generatePdf, deletePdf } from "@utils/pdf-utils";
import fs from "fs";
import path from "path";
import { Page } from "puppeteer";

jest.mock("fs");
jest.mock("puppeteer");

describe("pdf-utils", () => {
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  describe("generatePdf", () => {
    it("should generate a PDF", async () => {
      const mockPage = {
        pdf: jest.fn(),
      } as unknown as Page;

      const pdfName = "testPdf";
      const pdfDirectory = "./pdf/";
      const expectedPdfPath = path.join(pdfDirectory, `${pdfName}.pdf`);

      process.env.PDF_DIRECTORY = pdfDirectory;

      await generatePdf(mockPage, pdfName);

      expect(mockPage.pdf).toHaveBeenCalledWith({ path: expectedPdfPath });
    });

    describe("deletePdf", () => {
      it("should delete the PDF file if it exists", () => {
        const pdfName = "pdf";
        const pdfDirectory = "./pdf/";
        const expectedPdfPath = path.join(pdfDirectory, `${pdfName}.pdf`);

        (fs.existsSync as jest.Mock).mockReturnValue(true);
        (fs.unlinkSync as jest.Mock).mockReturnValue(undefined);

        deletePdf(pdfName);

        expect(fs.existsSync).toHaveBeenCalledWith(expectedPdfPath);
        expect(fs.unlinkSync).toHaveBeenCalledWith(expectedPdfPath);
        expect(consoleLogSpy).toHaveBeenCalled();
      });

      it("should log a message if the PDF file does not exist", () => {
        const pdfName = "nonexistent";
        const pdfDirectory = "./pdf/";
        const expectedPdfPath = path.join(pdfDirectory, `${pdfName}.pdf`);

        (fs.existsSync as jest.Mock).mockReturnValue(false);

        const consoleSpy = jest
          .spyOn(console, "log")
          .mockImplementation(() => {});

        deletePdf(pdfName);

        expect(fs.existsSync).toHaveBeenCalledWith(expectedPdfPath);
        expect(consoleSpy).toHaveBeenCalledWith(
          `PDF not found: ${expectedPdfPath}`,
        );
        expect(consoleLogSpy).toHaveBeenCalled();
      });
    });
  });
});
