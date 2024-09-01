import request from "supertest";
import app from "@src/app";
import { getPage } from "@managers/browser-manager";
import { generatePdf, getLastSavedPdf } from "@utils/pdf-utils";

jest.mock("@managers/browser-manager", () => ({
  getPage: jest.fn(),
}));

jest.mock("@utils/pdf-utils", () => ({
  generatePdf: jest.fn(),
  getLastSavedPdf: jest.fn(),
}));

describe("GET /get-page-content", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should return 400 if the page is not found", async () => {
    (getPage as jest.Mock).mockReturnValue(null);

    const response = await request(app)
      .get("/get-page-content")
      .query({ pageId: "invalid-id" });

    expect(response.status).toBe(400);
    expect(response.text).toBe("Page not found");
  });

  it("should return html content and the last saved PDF path", async () => {
    const mockPage = {
      content: jest.fn().mockResolvedValue("<html>Test Content</html>"),
    };
    (getPage as jest.Mock).mockReturnValue(mockPage);
    (generatePdf as jest.Mock).mockResolvedValue(undefined);
    (getLastSavedPdf as jest.Mock).mockReturnValue(
      "/path/to/last-saved-pdf.pdf",
    );

    const response = await request(app)
      .get("/get-page-content")
      .query({ pageId: "valid-id" });

    expect(response.status).toBe(200);
    expect(response.body.html).toBe("<html>Test Content</html>");
    expect(response.body.lastSavedPdf).toBe("/path/to/last-saved-pdf.pdf");

    expect(mockPage.content).toHaveBeenCalled();
    expect(generatePdf).toHaveBeenCalledWith(mockPage, "valid-id");
    expect(getLastSavedPdf).toHaveBeenCalled();
  });

  it("should return 500 if an error occurs", async () => {
    (getPage as jest.Mock).mockImplementation(() => {
      throw new Error("Unexpected error");
    });

    const response = await request(app)
      .get("/get-page-content")
      .query({ pageId: "valid-id" });

    expect(response.status).toBe(500);
    expect(response.text).toContain("Error while getting content");
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});