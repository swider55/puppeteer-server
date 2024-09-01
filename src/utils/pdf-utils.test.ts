import {
  generatePdf,
  deletePdf,
  deleteLastPdf,
  getLastSavedPdf,
  updateLastPdf,
} from "@utils/pdf-utils";
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
    it("should generate a PDF and set _lastSavedPdf", async () => {
      const mockPage = {
        pdf: jest.fn(),
      } as unknown as Page;

      const pdfName = "testPdf";
      const pdfDirectory = "./pdf/";
      const expectedPdfPath = path.join(pdfDirectory, `${pdfName}.pdf`);

      process.env.PDF_DIRECTORY = pdfDirectory;

      await generatePdf(mockPage, pdfName);

      expect(mockPage.pdf).toHaveBeenCalledWith({ path: expectedPdfPath });
      expect(getLastSavedPdf()).toBe(expectedPdfPath);
    });
  });

  describe("deletePdf", () => {
    it("should delete the PDF file if it exists", () => {
      const pdfPath = "/some/path/to/pdf.pdf";
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.unlinkSync as jest.Mock).mockReturnValue(undefined);

      deletePdf(pdfPath);

      expect(fs.existsSync).toHaveBeenCalledWith(pdfPath);
      expect(fs.unlinkSync).toHaveBeenCalledWith(pdfPath);
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it("should log a message if the PDF file does not exist", () => {
      const pdfPath = "/some/path/to/nonexistent.pdf";
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      const consoleSpy = jest
        .spyOn(console, "log")
        .mockImplementation(() => {});

      deletePdf(pdfPath);

      expect(fs.existsSync).toHaveBeenCalledWith(pdfPath);
      expect(consoleSpy).toHaveBeenCalledWith(`PDF not found: ${pdfPath}`);
      expect(consoleLogSpy).toHaveBeenCalled();
    });
  });

  describe("deleteLastPdf", () => {
    it("should delete the last saved PDF if it exists", () => {
      const lastPdfPath = "/some/path/to/lastPdf.pdf";
      updateLastPdf(lastPdfPath);

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.unlinkSync as jest.Mock).mockReturnValue(undefined);

      deleteLastPdf();

      expect(fs.existsSync).toHaveBeenCalledWith(lastPdfPath);
      expect(fs.unlinkSync).toHaveBeenCalledWith(lastPdfPath);
    });

    it("should not attempt to delete a PDF if _lastSavedPdf is null", () => {
      updateLastPdf(null as unknown as string); // Simulate null state

      deleteLastPdf();

      expect(fs.existsSync).not.toHaveBeenCalled();
      expect(fs.unlinkSync).not.toHaveBeenCalled();
    });
  });

  describe("getLastSavedPdf", () => {
    it("should return the last saved PDF path", () => {
      const lastPdfPath = "/some/path/to/lastPdf.pdf";
      updateLastPdf(lastPdfPath);

      expect(getLastSavedPdf()).toBe(lastPdfPath);
    });
  });

  describe("updateLastPdf", () => {
    it("should update _lastSavedPdf", () => {
      const newPdfPath = "/new/path/to/pdf.pdf";
      updateLastPdf(newPdfPath);

      expect(getLastSavedPdf()).toBe(newPdfPath);
    });
  });
});
