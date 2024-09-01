import request from "supertest";
import app from "@src/app";
import { getPage } from "@managers/browser-manager";
import { generatePdf, deleteLastPdf } from "@utils/pdf-utils";

jest.mock("@managers/browser-manager", () => ({
  getPage: jest.fn(),
}));

jest.mock("@utils/pdf-utils", () => ({
  generatePdf: jest.fn(),
  deleteLastPdf: jest.fn(),
}));

describe("POST /your-endpoint-path", () => {
  const mockPage = {
    goto: jest.fn(),
  };

  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should return 400 if the page is not found", async () => {
    (getPage as jest.Mock).mockReturnValueOnce(null);

    const response = await request(app)
      .post("/open-url-in-existing-page")
      .send({ pageId: "nonexistentPageId", url: "http://example.com" });

    expect(response.status).toBe(400);
    expect(response.text).toBe("Page not found");
  });

  it("should generate PDF, delete the last one, go to URL and return the status", async () => {
    (getPage as jest.Mock).mockReturnValueOnce(mockPage);
    mockPage.goto.mockResolvedValueOnce({ status: () => 200 });

    const response = await request(app)
      .post("/open-url-in-existing-page")
      .send({ pageId: "validPageId", url: "http://example.com" });

    expect(deleteLastPdf).toHaveBeenCalled();
    expect(generatePdf).toHaveBeenCalledWith(mockPage, "validPageId");
    expect(mockPage.goto).toHaveBeenCalledWith("http://example.com");
    expect(response.status).toBe(200);
    expect(response.body.response).toBe(200);
  });

  it("should return 500 if an error occurs", async () => {
    (getPage as jest.Mock).mockReturnValueOnce(mockPage);
    mockPage.goto.mockRejectedValueOnce(new Error("Failed to navigate"));

    const response = await request(app)
      .post("/open-url-in-existing-page")
      .send({ pageId: "validPageId", url: "http://example.com" });

    expect(response.status).toBe(500);
    expect(response.text).toContain("Error while opening url tab");
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
