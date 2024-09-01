import request from "supertest";
import app from "@src/app";
import { getPage } from "@managers/browser-manager";

jest.mock("@managers/browser-manager");

describe("POST /close-page", () => {
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
      .post("/close-page")
      .send({ pageId: "non-existing-page-id" });

    expect(response.status).toBe(400);
    expect(response.text).toBe("Page not found");
  });

  it('should close the page and return "Page closed"', async () => {
    const closeMock = jest.fn();
    (getPage as jest.Mock).mockReturnValueOnce({ close: closeMock });

    const response = await request(app)
      .post("/close-page")
      .send({ pageId: "existing-page-id" });

    expect(response.status).toBe(200);
    expect(response.text).toBe("Page closed");
    expect(closeMock).toHaveBeenCalled();
  });

  it("should return 500 if an error occurs while closing the page", async () => {
    const closeMock = jest.fn().mockRejectedValue(new Error("Close error"));
    (getPage as jest.Mock).mockReturnValueOnce({ close: closeMock });

    const response = await request(app)
      .post("/close-page")
      .send({ pageId: "existing-page-id" });

    expect(response.status).toBe(500);
    expect(response.text).toContain("Error while closing the tab");
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
