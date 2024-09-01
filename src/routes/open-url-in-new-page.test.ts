import request from "supertest";
import app from "@src/app";

describe("POST /open-url-in-new-page", () => {
  it("should return 400 if the browser is not started", async () => {
    const response = await request(app)
      .post("/open-url-in-new-page")
      .send({ url: "http://example.com" });

    expect(response.status).toBe(400);
    expect(response.text).toBe("Browser not started");
  });

  it("should open a new page and return pageId", async () => {
    const browserMock = {
      newPage: jest.fn().mockResolvedValue({
        goto: jest.fn().mockResolvedValue(null),
      }),
    };
    jest
      .spyOn(require("@managers/browser-manager"), "getBrowser")
      .mockReturnValue(browserMock);
    const setNewPageMock = jest.spyOn(
      require("@managers/browser-manager"),
      "setNewPage",
    );

    const response = await request(app)
      .post("/open-url-in-new-page")
      .send({ url: "http://example.com" });

    expect(response.status).toBe(200);
    expect(response.body.pageId).toBeDefined();
    expect(setNewPageMock).toHaveBeenCalled();
  });
});
