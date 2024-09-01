import request from "supertest";
import app from "@src/app";
import { getPage } from "@managers/browser-manager";
import { generatePdf, deleteLastPdf } from "@utils/pdf-utils";

jest.mock("@managers/browser-manager");
jest.mock("@utils/pdf-utils");

describe("POST /click-element", () => {
  const mockPage = {
    click: jest.fn(),
    waitForNavigation: jest.fn().mockResolvedValue(null),
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
    (getPage as jest.Mock).mockReturnValue(null);

    const response = await request(app)
      .post("/click-element")
      .send({ pageId: "non-existent-id", selector: "#button" });

    expect(response.status).toBe(400);
    expect(response.text).toBe("Page not found");
  });

  it("should generate PDF and click the element with navigation", async () => {
    (getPage as jest.Mock).mockReturnValue(mockPage);

    const response = await request(app)
      .post("/click-element")
      .send({ pageId: "page-id", selector: "#button" });

    expect(deleteLastPdf).toHaveBeenCalled();
    expect(generatePdf).toHaveBeenCalledWith(mockPage, "page-id");
    expect(mockPage.click).toHaveBeenCalledWith("#button");
    expect(mockPage.waitForNavigation).toHaveBeenCalledWith({
      waitUntil: "networkidle2",
    });
    expect(response.status).toBe(200);
    expect(response.text).toBe("Element clicked");
  });

  it("should generate PDF and click the element without navigation if optional is true", async () => {
    (getPage as jest.Mock).mockReturnValue(mockPage);

    const response = await request(app)
      .post("/click-element")
      .send({ pageId: "page-id", selector: "#button", optional: true });

    expect(deleteLastPdf).toHaveBeenCalled();
    expect(generatePdf).toHaveBeenCalledWith(mockPage, "page-id");
    expect(mockPage.click).toHaveBeenCalledWith("#button");
    expect(mockPage.waitForNavigation).not.toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.text).toBe("Element clicked");
  });

  it("should handle errors during click when optional is true", async () => {
    (getPage as jest.Mock).mockReturnValue(mockPage);
    mockPage.click.mockRejectedValueOnce(new Error("Click failed"));

    const response = await request(app)
      .post("/click-element")
      .send({ pageId: "page-id", selector: "#button", optional: true });

    expect(deleteLastPdf).toHaveBeenCalled();
    expect(generatePdf).toHaveBeenCalledWith(mockPage, "page-id");
    expect(mockPage.click).toHaveBeenCalledWith("#button");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Element clicked");
  });

  it("should return 500 if an error occurs during the process", async () => {
    (getPage as jest.Mock).mockReturnValue(mockPage);
    mockPage.click.mockRejectedValueOnce(new Error("Unexpected error"));

    const response = await request(app)
      .post("/click-element")
      .send({ pageId: "page-id", selector: "#button" });

    expect(response.status).toBe(500);
    expect(response.text).toContain("Error while cliking element.");
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
