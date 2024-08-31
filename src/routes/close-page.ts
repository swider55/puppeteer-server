import { Router } from "express";
import { getPage } from "@managers/browser-manager";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const pageId = req.body.pageId;
    const page = getPage(pageId);

    if (!page) return res.status(400).send("Page not found");

    await page.close();

    return res.send("Page closed");
  } catch (error) {
    const response = "Error while closing the tab. ";
    console.error(response + error);
    return res.status(500).send(response);
  }
});

export default router;
