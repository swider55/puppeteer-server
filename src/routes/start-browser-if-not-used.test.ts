import request from "supertest";
import app from "@src/app";
import { startBrowser, getBrowser } from "@managers/browser-manager";

jest.mock("@managers/browser-manager", () => ({
  getBrowser: jest.fn(),
  startBrowser: jest.fn(),
}));

describe("GET /start-browser-if-not-used", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should return 423 if the browser is already in use", async () => {
    (getBrowser as jest.Mock).mockReturnValue({});

    const response = await request(app).get("/start-browser-if-not-used");

    expect(response.status).toBe(423); 
    expect(response.text).toBe("Browser is already used");
  });

  it("should start the browser if not already in use and return 200", async () => {
    // Mock that the browser is not running
    (getBrowser as jest.Mock).mockReturnValue(null);  // symulacja braku przeglądarki

    const response = await request(app).get("/start-browser-if-not-used");

    expect(response.status).toBe(200);  // Sprawdzamy, czy status to 200
    expect(response.text).toBe("Browser started");
    expect(startBrowser).toHaveBeenCalled();  // Sprawdzamy, czy startBrowser został wywołany
  });

  it("should return 500 if there is an error while starting the browser", async () => {
    // Mock that the browser is not running
    (getBrowser as jest.Mock).mockReturnValue(null);  // symulacja braku przeglądarki

    // Mock startBrowser to throw an error
    (startBrowser as jest.Mock).mockRejectedValue(new Error("Failed to start browser"));  // Symulujemy błąd przy starcie przeglądarki

    const response = await request(app).get("/start-browser-if-not-used");

    expect(response.status).toBe(500);  // Sprawdzamy, czy status to 500
    expect(response.text).toContain("Error while staring browser");

    // Opcjonalnie: sprawdzamy, czy error został zalogowany
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining("Failed to start browser"));
  });
});
