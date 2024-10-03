import request from "supertest";
import app from "@src/app";
import { getBrowser, closeBrowser } from "@managers/browser-manager";

jest.mock("@managers/browser-manager", () => ({
  getBrowser: jest.fn(),
  closeBrowser: jest.fn(),
}));

describe("DELETE /close-browser", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should return 400 if no browser is running", async () => {
    (getBrowser as jest.Mock).mockReturnValue(null);

    const response = await request(app).delete("/close-browser").send();

    expect(response.status).toBe(400);
    expect(response.text).toBe("No browser run");
  });

  it("should close the browser and return a success message", async () => {
    (getBrowser as jest.Mock).mockReturnValue({});

    const response = await request(app).delete("/close-browser").send();

    expect(response.status).toBe(200);
    expect(response.text).toBe("Browser closed");
    expect(closeBrowser).toHaveBeenCalled(); 
  });

  it("should return 500 if an error occurs while closing the browser", async () => {
    (getBrowser as jest.Mock).mockReturnValue({});

    (closeBrowser as jest.Mock).mockImplementation(() => {
      throw new Error("Mocked closeBrowser error");
    });
  
    const response = await request(app).delete("/close-browser").send();
  
    expect(response.status).toBe(500);
    expect(response.text).toContain("Error while closing the browser.");
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining("Mocked closeBrowser error"));

  });
});
