import request from "supertest";
import app from "@src/app";
import { getPage } from "@managers/browser-manager";

jest.mock("@managers/browser-manager", () => ({
  getPage: jest.fn(),
}));

describe("PUT /type-in-page", () => {
  const mockPage = {
    type: jest.fn(),
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
      .put("/type-in-page")
      .send({ pageId: "nonexistentPageId", text: "Example text", selector: "some selector" });

    expect(response.status).toBe(400);
    expect(response.text).toBe("Page not found");
  });

  it("should type in page and return 'Text entered'", async () => {
    (getPage as jest.Mock).mockReturnValueOnce(mockPage);

    const response = await request(app)
      .put("/type-in-page")
      .send({ pageId: "existentPageId", text: "Example text", selector: "some selector" });

      expect(mockPage.type).toHaveBeenCalledWith("some selector", "Example text", {delay: 100});
      expect(response.status).toBe(200);
      expect(response.text).toBe("Text entered");
  });

  it("should return 500 if an error occurs", async () => {
    (getPage as jest.Mock).mockReturnValueOnce(mockPage);
    mockPage.type.mockRejectedValueOnce(new Error("Failed"));

    const response = await request(app)
      .put("/type-in-page")
      .send({ pageId: "existentPageId", text: "Example text", selector: "some selector" });

    expect(response.status).toBe(500);
    expect(response.text).toContain("Error while typing ");
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
