import request from "supertest";
import app from "@src/app";
import { getPage } from "@managers/browser-manager";
import { generatePdf, deletePdf } from "@utils/pdf-utils";

jest.mock("@managers/browser-manager", () => ({
  getPage: jest.fn(),
}));

jest.mock("@utils/pdf-utils", () => ({
  generatePdf: jest.fn(),
  deletePdf: jest.fn(),
}));

describe("POST /go-back-in-page", () => {
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
      .post("/go-back-in-page")
      .send({ pageId: "non-existing-id" });

    expect(response.status).toBe(400);
    expect(response.text).toBe("Page not found");
  });

  it("should generate PDF, go back and return success message", async () => {
    const pageMock = {
      goBack: jest.fn().mockResolvedValue(null),
    };

    (getPage as jest.Mock).mockReturnValue(pageMock);

    const response = await request(app)
      .post("/go-back-in-page")
      .send({ pageId: "existing-id" });

    expect(response.status).toBe(200);
    expect(response.text).toBe("Go back clicked");

    expect(getPage).toHaveBeenCalledWith("existing-id");
    expect(deletePdf).toHaveBeenCalled();
    expect(generatePdf).toHaveBeenCalledWith(pageMock, "existing-id");
    expect(pageMock.goBack).toHaveBeenCalled();
  });

  it("should handle errors and return 500", async () => {
    (getPage as jest.Mock).mockImplementation(() => {
      throw new Error("Some error");
    });

    const response = await request(app)
      .post("/go-back-in-page")
      .send({ pageId: "existing-id" });

    expect(response.status).toBe(500);
    expect(response.text).toContain("Error while going back");
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
