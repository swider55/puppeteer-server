import request from "supertest";
import app from "@src/app";
import { startBrowser } from "@managers/browser-manager";

jest.mock("@managers/browser-manager", () => ({
  startBrowser: jest.fn(),
}));

describe("GET /start-browser", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should start the browser and return "Browser started"', async () => {
    (startBrowser as jest.Mock).mockResolvedValueOnce(undefined);

    const response = await request(app).get("/start-browser");

    expect(response.status).toBe(200);
    expect(response.text).toBe("Browser started");
    expect(startBrowser).toHaveBeenCalled();
  });

  it("should return 500 if there is an error starting the browser", async () => {
    (startBrowser as jest.Mock).mockRejectedValueOnce(
      new Error("Browser failed to start"),
    );

    const response = await request(app).get("/start-browser");

    expect(response.status).toBe(500);
    expect(response.text).toContain("Error while staring browser");
    expect(startBrowser).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
